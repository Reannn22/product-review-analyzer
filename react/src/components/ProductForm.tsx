import { useState } from 'react';
import { Save, X } from 'lucide-react';

interface ProductFormProps {
    onSubmit: (name: string, description: string) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function ProductForm({ onSubmit, onCancel, loading = false }: ProductFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Product name is required');
            return;
        }
        try {
            await onSubmit(name, description);
            setName('');
            setDescription('');
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
        }
    };

    return (
        <div className="card mb-6 animate-in fade-in-up duration-300">
            <div className="card-header">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="Enter product name"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field resize-none"
                            placeholder="Enter product description (optional)"
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 btn btn-primary inline-flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 btn btn-secondary inline-flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
                     