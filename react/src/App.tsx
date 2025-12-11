import { useState, useEffect } from 'react'
import './App.css'
import reviewService, { Product, ReviewAnalysisResult, Review, Stats } from './api/reviewService'
import { LoadingState } from './components/LoadingState'
import { ErrorMessage } from './components/ErrorMessage'
import { ResultDisplay } from './components/ResultDisplay'
import { ReviewsList } from './components/ReviewsList'

function App() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [newProductName, setNewProductName] = useState('')
  const [newProductDescription, setNewProductDescription] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [analysisResult, setAnalysisResult] = useState<ReviewAnalysisResult | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  // Loading and error states
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        // Check backend health
        await reviewService.healthCheck()
        // Load products
        await loadProducts()
      } catch (err) {
        setError(`Backend connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setLoadingProducts(false)
      }
    }
    init()
  }, [])

  // Load products
  const loadProducts = async () => {
    try {
      const data = await reviewService.getProducts()
      setProducts(data)
      if (data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id)
        await loadReviewsForProduct(data[0].id)
      }
      setLoadingProducts(false)
    } catch (err) {
      setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoadingProducts(false)
    }
  }

  // Load reviews and stats for a product
  const loadReviewsForProduct = async (productId: number) => {
    setLoadingReviews(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getProductReviews(productId),
        reviewService.getStats(productId),
      ])
      setReviews(reviewsData)
      setStats(statsData)
      setLoadingReviews(false)
    } catch (err) {
      setError(`Failed to load reviews: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoadingReviews(false)
    }
  }

  // Handle product selection
  const handleProductSelect = async (productId: number) => {
    setSelectedProductId(productId)
    await loadReviewsForProduct(productId)
  }

  // Handle create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductName.trim()) {
      setError('Product name is required')
      return
    }

    try {
      const newProduct = await reviewService.createProduct(
        newProductName,
        newProductDescription
      )
      setProducts([...products, newProduct])
      setSelectedProductId(newProduct.id)
      setNewProductName('')
      setNewProductDescription('')
      setShowCreateProduct(false)
      await loadReviewsForProduct(newProduct.id)
    } catch (err) {
      setError(`Failed to create product: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProductId) {
      setError('Please select a product')
      return
    }

    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long')
      return
    }

    setLoadingAnalysis(true)
    setError(null)

    try {
      const result = await reviewService.analyzeReview(selectedProductId, reviewText)
      setAnalysisResult(result)
      setReviewText('')

      // Reload reviews and stats
      await loadReviewsForProduct(selectedProductId)
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  if (loadingProducts) {
    return <LoadingState message="Loading application..." />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Product Review Analyzer</h1>
          <p>Analyze sentiment and extract key insights from product reviews</p>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        <div className="app-layout">
          {/* Sidebar - Products */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <h3>Products</h3>
              {products.length === 0 ? (
                <p className="sidebar-empty">No products yet</p>
              ) : (
                <div className="products-list">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      className={`product-button ${selectedProductId === product.id ? 'active' : ''}`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="btn-secondary"
                onClick={() => setShowCreateProduct(!showCreateProduct)}
              >
                {showCreateProduct ? 'Cancel' : '+ Add Product'}
              </button>

              {showCreateProduct && (
                <form onSubmit={handleCreateProduct} className="create-product-form">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    rows={3}
                  />
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </form>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <section className="main-content">
            {selectedProductId ? (
              <>
                {/* Review Form */}
                <div className="form-section">
                  <h2>Submit Review</h2>
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Enter your review here... (minimum 10 characters)"
                      rows={6}
                      disabled={loadingAnalysis}
                    />
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loadingAnalysis || reviewText.trim().length < 10}
                      >
                        {loadingAnalysis ? 'Analyzing...' : 'Analyze Review'}
                      </button>
                      <span className="char-count">
                        {reviewText.length} / 5000 characters
                      </span>
                    </div>
                  </form>
                </div>

                {/* Analysis Result */}
                {loadingAnalysis ? (
                  <LoadingState message="Analyzing your review..." />
                ) : (
                  analysisResult && <ResultDisplay result={analysisResult} />
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                  <LoadingState message="Loading reviews..." />
                ) : (
                  <ReviewsList reviews={reviews} stats={stats} />
                )}
              </>
            ) : (
              <div className="no-product">
                <p>No product selected. Create or select a product to get started.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
