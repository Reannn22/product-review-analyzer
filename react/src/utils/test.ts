/**
 * Testing utilities for components and hooks
 */

export function mockFetch(data: unknown, status: number = 200) {
  return jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
    })
  );
}

export function createMockProduct(overrides = {}) {
  return {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockReview(overrides = {}) {
  return {
    id: 1,
    product_id: 1,
    text: 'This is a test review text that is long enough to pass validation',
    sentiment: 'positive' as const,
    sentiment_score: 0.85,
    key_points: ['Good quality', 'Great price'],
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockStats(overrides = {}) {
  return {
    total_reviews: 10,
    average_sentiment_score: 0.75,
    sentiment_distribution: {
      positive: 7,
      negative: 2,
      neutral: 1,
    },
    ...overrides,
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
