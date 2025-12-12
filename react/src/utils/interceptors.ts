/**
 * API request/response interceptor
 */

export interface Interceptor<T> {
  (data: T): T | Promise<T>;
}

export class RequestInterceptor {
  private static interceptors: Interceptor<Request>[] = [];

  static use(interceptor: Interceptor<Request>): void {
    this.interceptors.push(interceptor);
  }

  static async process(request: Request): Promise<Request> {
    let processedRequest = request;
    for (const interceptor of this.interceptors) {
      processedRequest = (await interceptor(processedRequest)) as Request;
    }
    return processedRequest;
  }

  static clear(): void {
    this.interceptors = [];
  }
}

export class ResponseInterceptor {
  private static interceptors: Interceptor<Response>[] = [];

  static use(interceptor: Interceptor<Response>): void {
    this.interceptors.push(interceptor);
  }

  static async process(response: Response): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.interceptors) {
      processedResponse = (await interceptor(processedResponse)) as Response;
    }
    return processedResponse;
  }

  static clear(): void {
    this.interceptors = [];
  }
}

// Default interceptors
RequestInterceptor.use((request) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

ResponseInterceptor.use((response) => {
  if (response.status === 401) {
    console.log('Unauthorized - redirecting to login');
    // Handle unauthorized
  }
  return response;
});
