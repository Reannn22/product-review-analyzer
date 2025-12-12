import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="space-y-4 text-center">
                <div className="flex justify-center">
                    <Loader2 className="w-14 h-14 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-semibold">{message}</p>
            </div>
        </div>
    );
};
