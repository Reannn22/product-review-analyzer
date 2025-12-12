/**
 * Error handling utilities
 */

type AppErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR';

export class AppError extends Error {
  code: AppErrorCode;
  statusCode: number;
  details?: unknown;
  
  constructor(code: AppErrorCode, message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function createError(
  code: AppErrorCode,
  message: string,
  statusCode: number = 500,
  details?: unknown
): AppError {
  return new AppError(code, message, statusCode, details);
}

export function handleError(error: unknown): { message: string; code: string } {
  if (error instanceof AppError) {
    return { message: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { message: error.message, code: 'UNKNOWN_ERROR' };
  }
  return { message: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const ErrorMessages = {
  VALIDATION_ERROR: 'Please check your input and try again',
  API_ERROR: 'API request failed',
  NETWORK_ERROR: 'Network connection error',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Authentication required',
  INTERNAL_ERROR: 'An internal error occurred',
} as const;
