/**
 * TypeScript type definitions for the application
 */

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface Product {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  product_id: number;
  text: string;
  sentiment: Sentiment;
  sentiment_score: number;
  key_points: string[];
  created_at: string;
}

export interface AnalysisResult {
  id: number;
  product_id: number;
  text: string;
  sentiment: Sentiment;
  sentiment_score: number;
  key_points: string[];
  created_at: string;
}

export interface Stats {
  total_reviews: number;
  average_sentiment_score: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  timestamp: string;
}
