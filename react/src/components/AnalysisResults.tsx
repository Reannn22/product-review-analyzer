import type { ReviewAnalysisResult } from '../api/reviewService';
import { SentimentBadge } from './SentimentBadge';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AnalysisResultsProps {
    result: ReviewAnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
    return (
        <div className="card mb-6 border-l-4 border-blue-500 animate-in fade-in-up duration-500 overflow-hidden">
            <div className="card-header bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300">Analysis Results</h2>
                </div>
            </div>

            <div className="card-body space-y-6">
                {/* Sentiment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Sentiment</p>
                        <SentimentBadge sentiment={result.sentiment} score={result.sentiment_score} />
                    </div>

                    {/* Confidence Score */}
                    <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Confidence Score</p>
                        <div className="space-y-2">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${result.sentiment === 'positive'
                                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                                        : result.sentiment === 'negative'
                                            ? 'bg-gradient-to-r from-red-400 to-red-500'
                                            : 'bg-gradient-to-r from-slate-400 to-slate-500'
                                        }`}
                                    style={{ width: `${result.sentiment_score * 100}%` }}
                                />
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {(result.sentiment_score * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Points */}
                {result.key_points && result.key_points.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Key Points</p>
                        <ul className="space-y-2">
                            {result.key_points.map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
