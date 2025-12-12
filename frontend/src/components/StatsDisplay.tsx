import type { Stats } from '../api/reviewService';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface StatsDisplayProps {
    stats: Stats | null;
    loading?: boolean;
}

export function StatsDisplay({ stats, loading = false }: StatsDisplayProps) {
    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="card-header">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
                <div className="card-body space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const total = stats.sentiment_distribution.positive + stats.sentiment_distribution.negative + stats.sentiment_distribution.neutral;
    const positivePercent = total > 0 ? (stats.sentiment_distribution.positive / total) * 100 : 0;
    const negativePercent = total > 0 ? (stats.sentiment_distribution.negative / total) * 100 : 0;
    const neutralPercent = total > 0 ? (stats.sentiment_distribution.neutral / total) * 100 : 0;

    return (
        <div className="card">
            <div className="card-header">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sentiment Statistics</h2>
                </div>
            </div>
            <div className="card-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Summary Cards */}
                    <div className="space-y-4">
                        <div className="stat-card stat-card-primary">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Total Reviews</p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-300 mt-2">{stats.total_reviews}</p>
                        </div>

                        <div className="stat-card stat-card-warning">
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide">Avg. Sentiment Score</p>
                            <p className="text-4xl font-bold text-amber-900 dark:text-amber-300 mt-2">
                                {(stats.average_sentiment_score * 100).toFixed(0)}%
                            </p>
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="space-y-5">
                        {/* Positive */}
                        <div>
                            <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Positive</p>
                                </div>
                                <span className="badge badge-positive text-xs">
                                    {stats.sentiment_distribution.positive} ({positivePercent.toFixed(0)}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${positivePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Negative */}
                        <div>
                            <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Negative</p>
                                </div>
                                <span className="badge badge-negative text-xs">
                                    {stats.sentiment_distribution.negative} ({negativePercent.toFixed(0)}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-red-400 to-red-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${negativePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Neutral */}
                        <div>
                            <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center gap-2">
                                    <Minus className="w-4 h-4 text-slate-600" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Neutral</p>
                                </div>
                                <span className="badge badge-neutral text-xs">
                                    {stats.sentiment_distribution.neutral} ({neutralPercent.toFixed(0)}%)
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-slate-400 to-slate-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${neutralPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
