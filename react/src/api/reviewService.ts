const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Product {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface ReviewAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  key_points: string[];
}

export interface Review {
  id: number;
  product_id: number;
  review_text: string;
  sentiment?: string;
  sentiment_score?: number;
  key_points?: string[];
  created_at: string;
  analyzed_at?: string;
  product: Product;
}

export interface Stats {
  total_reviews: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  average_sentiment_score: number;
}

class ReviewService {
  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  /**
   * Create a new product
   */
  async createProduct(name: string, description?: string): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  /**
   * Analyze a review
   */
  async analyzeReview(
    productId: number,
    reviewText: string
  ): Promise<ReviewAnalysisResult> {
    const response = await fetch(`${API_URL}/api/analyze-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        review_text: reviewText,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze review');
    }
    return response.json();
  }

  /**
   * Get all reviews with optional filtering
   */
  async getReviews(productId?: number, sentiment?: string): Promise<Review[]> {
    const params = new URLSearchParams();
    if (productId) params.append('product_id', productId.toString());
    if (sentiment) params.append('sentiment', sentiment);

    const response = await fetch(`${API_URL}/api/reviews?${params}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }

  /**
   * Get reviews for a specific product
   */
  async getProductReviews(productId: number): Promise<Review[]> {
    return this.getReviews(productId);
  }

  /**
   * Get statistics
   */
  async getStats(productId?: number): Promise<Stats> {
    const params = new URLSearchParams();
    if (productId) params.append('product_id', productId.toString());

    const response = await fetch(`${API_URL}/api/stats?${params}`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('Backend is not available');
    return response.json();
  }
}

export default new ReviewService();
