/**
 * Data context for managing products and reviews state
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Review, Stats } from '../types';

interface DataContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  selectedProductId: number | null;
  setSelectedProductId: (id: number | null) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  stats: Stats | null;
  setStats: (stats: Stats | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const value: DataContextType = {
    products,
    setProducts,
    selectedProductId,
    setSelectedProductId,
    reviews,
    setReviews,
    stats,
    setStats,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
