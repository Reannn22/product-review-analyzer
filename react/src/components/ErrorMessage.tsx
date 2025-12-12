import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 rounded-lg p-4 mb-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-400 font-medium">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex-shrink-0 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
