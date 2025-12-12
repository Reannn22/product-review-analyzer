/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private static startTimes: Map<string, number> = new Map();

  static start(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  static end(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`PerformanceMonitor: Label "${label}" was never started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(label);

    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
  }
}

export function logMetric(name: string, value: number, unit: string = ''): void {
  console.log(`Metric: ${name} = ${value}${unit}`);
}

export function reportWebVitals(): void {
  const windowObj = typeof window !== 'undefined' ? window : null;
  if (windowObj && 'web-vital' in windowObj) {
    const vitals = (windowObj as Record<string, unknown>)['web-vital'];
    console.log('Web Vitals:', vitals);
  }
}
