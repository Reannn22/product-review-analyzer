/**
 * Theme and style configuration
 */

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  theme: Theme;
  primaryColor: string;
  accentColor: string;
}

export const defaultTheme: ThemeConfig = {
  theme: 'auto',
  primaryColor: '#3B82F6',
  accentColor: '#0EA5E9',
};

export const themeVariables = {
  light: {
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-200',
    card: 'bg-slate-50',
  },
  dark: {
    bg: 'bg-slate-950',
    text: 'text-slate-50',
    border: 'border-slate-800',
    card: 'bg-slate-900',
  },
};

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
  
  if (actualTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}
