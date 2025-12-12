import type { Product } from '../api/reviewService';

interface ProductSelectorProps {
    products: Product[];
    selectedProductId: number | null;
    onSelectProduct: (id: number) => void;
}

export function ProductSelector({ products, selectedProductId, onSelectProduct }: ProductSelectorProps) {
    if (products.length === 0) {
        return (
            <div className="card p-8 text-center mb-6">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No products available. Create one to get started!</p>
            </div>
        );
    }

    return (
        <div className="card mb-6">
            <div className="card-header">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Product</h2>
            </div>
            <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onSelectProduct(product.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${selectedProductId === product.id
                                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20 ring-2 ring-blue-400/30 shadow-md'
                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                            {product.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                                    {product.description}
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
