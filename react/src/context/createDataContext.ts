import { createContext } from 'react';
import type { Product, Review, Stats } from '../types';

export interface DataContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  selectedProductId: number | null;
  setSelectedProductId: (id: number | null) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  stats: Stats | null;
  setStats: (stats: Stats | null) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
