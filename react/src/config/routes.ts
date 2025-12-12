/**
 * Router configuration and navigation utilities
 */

export enum Routes {
  HOME = '/',
  PRODUCTS = '/products',
  PRODUCT_DETAIL = '/products/:id',
  REVIEWS = '/reviews',
  SETTINGS = '/settings',
  NOT_FOUND = '/404',
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: Routes.HOME, icon: 'home' },
  { label: 'Products', path: Routes.PRODUCTS, icon: 'box' },
  { label: 'Reviews', path: Routes.REVIEWS, icon: 'message-square' },
  { label: 'Settings', path: Routes.SETTINGS, icon: 'settings' },
];

export function getRoutePath(route: Routes, params?: Record<string, string>): string {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }
  return path;
}
