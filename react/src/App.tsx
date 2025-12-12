import { useState, useEffect } from 'react'
import { Plus, BarChart3 } from 'lucide-react'
import type { Product, ReviewAnalysisResult, Review, Stats } from './api/reviewService'
import reviewService from './api/reviewService'
import { LoadingState } from './components/LoadingState'
import { ErrorMessage } from './components/ErrorMessage'
import { AnalysisResults } from './components/AnalysisResults'
import { ReviewsList } from './components/ReviewsList'
import { ProductForm } from './components/ProductForm'
import { ProductSelector } from './components/ProductSelector'
import { ReviewForm } from './components/ReviewForm'
import { StatsDisplay } from './components/StatsDisplay'

function App() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [analysisResult, setAnalysisResult] = useState<ReviewAnalysisResult | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  // Loading and error states
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        await reviewService.healthCheck()
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
    setLoadingStats(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getProductReviews(productId),
        reviewService.getStats(productId),
      ])
      setReviews(reviewsData)
      setStats(statsData)
    } catch (err) {
      setError(`Failed to load reviews: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoadingReviews(false)
      setLoadingStats(false)
    }
  }

  // Handle product selection
  const handleProductSelect = async (productId: number) => {
    setSelectedProductId(productId)
    await loadReviewsForProduct(productId)
  }

  // Handle create product
  const handleCreateProduct = async (name: string, description: string) => {
    try {
      const newProduct = await reviewService.createProduct(name, description)
      setProducts([...products, newProduct])
      setSelectedProductId(newProduct.id)
      setShowCreateProduct(false)
      await loadReviewsForProduct(newProduct.id)
      setError(null)
    } catch (err) {
      setError(`Failed to create product: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Handle review submission
  const handleSubmitReview = async (text: string) => {
    if (!selectedProductId) {
      setError('Please select a product')
      return
    }

    if (text.trim().length < 10) {
      setError('Review must be at least 10 characters long')
      return
    }

    setLoadingAnalysis(true)
    setError(null)

    try {
      const result = await reviewService.analyzeReview(selectedProductId, text)
      setAnalysisResult(result)

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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <header className="card border-b-2 border-blue-500/20 sticky top-0 z-50 w-full shadow-lg rounded-none">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Product Review Analyzer
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
                Analyze sentiment and extract key insights from product reviews
              </p>
            </div>
            <button
              onClick={() => setShowCreateProduct(!showCreateProduct)}
              className="btn btn-primary w-full sm:w-auto shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Product
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Create Product Form */}
          {showCreateProduct && (
            <ProductForm
              onSubmit={handleCreateProduct}
              onCancel={() => setShowCreateProduct(false)}
            />
          )}

          {/* Product Selector */}
          <ProductSelector
            products={products}
            selectedProductId={selectedProductId}
            onSelectProduct={handleProductSelect}
          />

          {selectedProductId ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Review Form */}
              <ReviewForm
                onSubmit={handleSubmitReview}
                loading={loadingAnalysis}
                disabled={!selectedProductId}
              />

              {/* Analysis Result */}
              {analysisResult && <AnalysisResults result={analysisResult} />}

              {/* Statistics */}
              <StatsDisplay stats={stats} loading={loadingStats} />

              {/* Reviews List */}
              {loadingReviews ? (
                <LoadingState message="Loading reviews..." />
              ) : (
                <ReviewsList reviews={reviews} />
              )}
            </div>
          ) : (
            <div className="card text-center p-8 sm:p-12">
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium">
                No product selected. Create or select a product to get started!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="card rounded-none border-t-2 border-slate-200 dark:border-slate-700 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Product Review Analyzer © 2025 | Powered by FastAPI & React
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
