/**
 * Custom hook for accessing data context
 */
import { useContext } from 'react';
import { DataContext } from '../context/createDataContext';

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
