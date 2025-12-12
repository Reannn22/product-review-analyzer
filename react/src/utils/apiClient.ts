/**
 * API request utilities and helper functions
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 30000;

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(response.status, `API Error: ${response.statusText}`, errorData);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new APIError(0, 'Network error: Unable to connect to server');
    }
    throw new APIError(500, error instanceof Error ? error.message : 'Unknown error');
  }
}

export const GET = <T>(endpoint: string) =>
  fetchAPI<T>(endpoint, { method: 'GET' });

export const POST = <T>(endpoint: string, body?: unknown) =>
  fetchAPI<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const PUT = <T>(endpoint: string, body?: unknown) =>
  fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const DELETE = <T>(endpoint: string) =>
  fetchAPI<T>(endpoint, { method: 'DELETE' });
