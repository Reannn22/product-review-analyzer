/**
 * Common utility functions
 */

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = key(item);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function mapToObject<T, K extends string | number | symbol, V>(
  array: T[],
  keyFn: (item: T) => K,
  valueFn: (item: T) => V
): Record<K, V> {
  return array.reduce((acc, item) => {
    acc[keyFn(item)] = valueFn(item);
    return acc;
  }, {} as Record<K, V>);
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, arr) => acc.concat(arr), []);
}
