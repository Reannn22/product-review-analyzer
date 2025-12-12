/**
 * Color and theme utilities
 */

export const colors = {
  primary: '#3B82F6',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#0EA5E9',
  slate: {
    50: '#F8FAFC',
    900: '#0F172A',
  },
};

export const sentimentColors = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280',
};

export const darkModeClass = 'dark';

export function getSentimentColor(sentiment: 'positive' | 'negative' | 'neutral'): string {
  return sentimentColors[sentiment];
}

export function getContrastColor(backgroundColor: string): string {
  // Simple luminance calculation
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
