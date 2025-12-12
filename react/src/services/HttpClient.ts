/**
 * HTTP client service with interceptors
 */
import { APIError } from '../utils/errors';
import { RequestInterceptor, ResponseInterceptor } from '../utils/interceptors';

export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = 'http://localhost:8000/api', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      let request = new Request(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      // Apply request interceptors
      request = await RequestInterceptor.process(request);

      let response = await fetch(request);

      // Apply response interceptors
      response = await ResponseInterceptor.process(response);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new APIError(response.status, `HTTP ${response.status}`, error);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof APIError) throw error;
      if (error instanceof TypeError) {
        throw new APIError(0, 'Network error');
      }
      throw new APIError(500, 'Unknown error', error);
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, body);
  }
}

export const httpClient = new HttpClient();
