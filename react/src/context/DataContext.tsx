/**
 * Data context provider component
 */
import React, { useState, type ReactNode } from 'react';
import { DataContext, type DataContextType } from './createDataContext';
import type { Product, Review, Stats } from '../types';

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
