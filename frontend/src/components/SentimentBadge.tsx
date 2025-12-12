import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface SentimentBadgeProps {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
}

export function SentimentBadge({ sentiment, score }: SentimentBadgeProps) {
    const badges = {
        positive: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-400',
            icon: ThumbsUp,
        },
        negative: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-700 dark:text-red-400',
            icon: ThumbsDown,
        },
        neutral: {
            bg: 'bg-slate-100 dark:bg-slate-700',
            text: 'text-slate-700 dark:text-slate-400',
            icon: Minus,
        },
    }[sentiment];

    const IconComponent = badges.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm whitespace-nowrap ${badges.bg} ${badges.text}`}>
            <IconComponent className="w-4 h-4" />
            <span className="capitalize">{sentiment}</span>
            <span className="opacity-80">({(score * 100).toFixed(0)}%)</span>
        </div>
    );
}
