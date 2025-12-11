import React from 'react';
import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
    return (
        <div className="error-container">
            <div className="error-content">
                <span className="error-icon">⚠️</span>
                <p className="error-message">{message}</p>
                {onDismiss && (
                    <button className="error-close" onClick={onDismiss}>×</button>
                )}
            </div>
        </div>
    );
};
