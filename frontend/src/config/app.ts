/**
 * Build configuration and metadata
 */

export const BUILD_INFO = {
  name: 'Product Review Analyzer',
  version: '1.0.0',
  buildTime: new Date().toISOString(),
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false',
  ENABLE_DEBUG: import.meta.env.VITE_DEBUG === 'true',
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};
