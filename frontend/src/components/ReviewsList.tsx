import React from 'react';
import type { Review } from '../api/reviewService';
import { SentimentBadge } from './SentimentBadge';
import { ChevronDown } from 'lucide-react';

interface ReviewsListProps {
    reviews: Review[];
    onLoadMore?: () => void;
    loading?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, onLoadMore, loading }) => {
    if (reviews.length === 0) {
        return (
            <div className="card p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No reviews yet. Submit your first review!</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Reviews List */}
            <div className="card overflow-hidden">
                <div className="card-header">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reviews ({reviews.length})</h2>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {reviews.map((review) => (
                        <div key={review.id} className="card-body hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 border-none shadow-none">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                        {review.product.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {formatDate(review.created_at)}
                                    </p>
                                </div>
                                {review.sentiment && (
                                    <SentimentBadge
                                        sentiment={review.sentiment as 'positive' | 'negative' | 'neutral'}
                                        score={review.sentiment_score || 0.5}
                                    />
                                )}
                            </div>

                            {/* Review Text */}
                            <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-base">
                                "{review.review_text}"
                            </p>

                            {/* Key Points */}
                            {review.key_points && review.key_points.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
                                        Key Points
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {review.key_points.map((point, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold"
                                            >
                                                ✓ {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Load More Button */}
            {onLoadMore && !loading && (
                <div className="flex justify-center pt-2">
                    <button
                        onClick={onLoadMore}
                        className="btn btn-secondary inline-flex items-center gap-2"
                    >
                        Load More Reviews
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
