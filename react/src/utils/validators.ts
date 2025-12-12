/**
 * Validation utilities for frontend
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateMinLength(text: string, minLength: number): boolean {
  return text.trim().length >= minLength;
}

export function validateMaxLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

export function validateNumberRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

export function validateRequired(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

export const validationRules = {
  productName: (value: string) => ({
    required: validateRequired(value),
    minLength: validateMinLength(value, 2),
    maxLength: validateMaxLength(value, 255),
  }),
  productDescription: (value: string) => ({
    maxLength: validateMaxLength(value, 2000),
  }),
  reviewText: (value: string) => ({
    required: validateRequired(value),
    minLength: validateMinLength(value, 10),
    maxLength: validateMaxLength(value, 1000),
  }),
};
