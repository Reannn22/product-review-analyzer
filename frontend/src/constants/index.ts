/**
 * Application constants
 */

export const APP_NAME = 'Product Review Analyzer';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Analyze sentiment and extract key insights from product reviews';

export const LIMITS = {
  MIN_PRODUCT_NAME_LENGTH: 2,
  MAX_PRODUCT_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 2000,
  MIN_REVIEW_LENGTH: 10,
  MAX_REVIEW_LENGTH: 1000,
  PAGINATION_DEFAULT: 10,
  PAGINATION_MAX: 100,
};

export const TIMING = {
  DEBOUNCE_MS: 300,
  THROTTLE_MS: 500,
  API_TIMEOUT_MS: 30000,
  ANIMATION_DURATION_MS: 300,
};

export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  LOADING: 'Loading...',
  NO_DATA: 'No data available',
};

export const SENTIMENT = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
