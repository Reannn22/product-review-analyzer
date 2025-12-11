import React from 'react';
import type { Review, Stats } from '../api/reviewService';
import '../styles/ReviewsList.css';

interface ReviewsListProps {
    reviews: Review[];
    stats?: Stats;
    onLoadMore?: () => void;
    loading?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, stats, onLoadMore, loading }) => {
    if (reviews.length === 0) {
        return (
            <div className="reviews-empty">
                <p>No reviews yet. Submit your first review!</p>
            </div>
        );
    }

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive':
                return '#10b981';
            case 'negative':
                return '#ef4444';
            default:
                return '#f59e0b';
        }
    };

    const getSentimentEmoji = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive':
                return '😊';
            case 'negative':
                return '😞';
            default:
                return '😐';
        }
    };

    return (
        <div className="reviews-container">
            {stats && (
                <div className="stats-summary">
                    <div className="stat-card">
                        <span className="stat-label">Total Reviews</span>
                        <span className="stat-value">{stats.total_reviews}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Positive</span>
                        <span className="stat-value positive">{stats.sentiment_distribution.positive}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Neutral</span>
                        <span className="stat-value neutral">{stats.sentiment_distribution.neutral}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Negative</span>
                        <span className="stat-value negative">{stats.sentiment_distribution.negative}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Avg Score</span>
                        <span className="stat-value">
                            {(stats.average_sentiment_score * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            )}

            <div className="reviews-list">
                <h3>Recent Reviews</h3>
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <div className="review-product">
                                <p className="review-product-name">{review.product.name}</p>
                                <p className="review-date">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            {review.sentiment && (
                                <div
                                    className="review-sentiment"
                                    style={{ borderLeftColor: getSentimentColor(review.sentiment) }}
                                >
                                    <span className="sentiment-emoji">
                                        {getSentimentEmoji(review.sentiment)}
                                    </span>
                                    <span className="sentiment-text">{review.sentiment}</span>
                                    {review.sentiment_score && (
                                        <span className="sentiment-score">
                                            {(review.sentiment_score * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="review-text">{review.review_text}</p>

                        {review.key_points && review.key_points.length > 0 && (
                            <div className="review-keypoints">
                                <span className="keypoints-label">Key Points:</span>
                                <div className="keypoints-tags">
                                    {review.key_points.map((point, idx) => (
                                        <span key={idx} className="keypoint-tag">
                                            {point}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {onLoadMore && !loading && (
                <button onClick={onLoadMore} className="load-more-btn">
                    Load More
                </button>
            )}
        </div>
    );
};
