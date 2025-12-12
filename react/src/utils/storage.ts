/**
 * Local storage management utilities
 */

const PREFIX = 'pra_'; // Product Review Analyzer

export const StorageKeys = {
  SELECTED_PRODUCT: `${PREFIX}selected_product`,
  USER_PREFERENCES: `${PREFIX}user_preferences`,
  API_CACHE: `${PREFIX}api_cache`,
  RECENT_SEARCHES: `${PREFIX}recent_searches`,
} as const;

export class StorageManager {
  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save to localStorage: ${error}`);
    }
  }

  static get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to read from localStorage: ${error}`);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage: ${error}`);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Failed to clear localStorage: ${error}`);
    }
  }

  static getAllKeys(): string[] {
    return Object.keys(localStorage);
  }
}
