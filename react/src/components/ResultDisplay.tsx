import React from 'react';
import type { ReviewAnalysisResult } from '../api/reviewService';
import '../styles/ResultDisplay.css';

interface ResultDisplayProps {
    result: ReviewAnalysisResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const sentimentColor =
        result.sentiment === 'positive'
            ? '#10b981'
            : result.sentiment === 'negative'
                ? '#ef4444'
                : '#f59e0b';

    const sentimentEmoji =
        result.sentiment === 'positive'
            ? '😊'
            : result.sentiment === 'negative'
                ? '😞'
                : '😐';

    return (
        <div className="result-container">
            <div className="result-header">
                <h3>Analysis Result</h3>
            </div>

            <div className="result-content">
                {/* Sentiment Section */}
                <div className="result-section">
                    <div className="sentiment-box" style={{ borderLeftColor: sentimentColor }}>
                        <div className="sentiment-header">
                            <span className="sentiment-emoji">{sentimentEmoji}</span>
                            <div className="sentiment-info">
                                <span className="sentiment-label">Sentiment</span>
                                <span
                                    className="sentiment-value"
                                    style={{ color: sentimentColor }}
                                >
                                    {result.sentiment.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="sentiment-score">
                            <span>Confidence: {(result.sentiment_score * 100).toFixed(1)}%</span>
                            <div className="score-bar">
                                <div
                                    className="score-fill"
                                    style={{
                                        width: `${result.sentiment_score * 100}%`,
                                        backgroundColor: sentimentColor,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Points Section */}
                {result.key_points && result.key_points.length > 0 && (
                    <div className="result-section">
                        <div className="keypoints-box">
                            <h4>Key Points</h4>
                            <ul className="keypoints-list">
                                {result.key_points.map((point, index) => (
                                    <li key={index} className="keypoint-item">
                                        <span className="keypoint-bullet">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
