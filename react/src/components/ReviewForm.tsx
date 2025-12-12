import { useState } from 'react';
import { Send } from 'lucide-react';

interface ReviewFormProps {
    onSubmit: (text: string) => Promise<void>;
    loading?: boolean;
    disabled?: boolean;
}

export function ReviewForm({ onSubmit, loading = false, disabled = false }: ReviewFormProps) {
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Review text is required');
            return;
        }
        try {
            await onSubmit(text);
            setText('');
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze review');
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Submit Review</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="input-field resize-none"
                            placeholder="Share your thoughts about this product..."
                            rows={4}
                            disabled={loading || disabled}
                            maxLength={1000}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right font-medium">
                            {text.length}/1000 characters
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading || disabled || !text.trim()}
                        className="w-full btn btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? 'Analyzing...' : 'Analyze Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
