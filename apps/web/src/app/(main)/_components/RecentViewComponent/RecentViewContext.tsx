'use client';
import { useState, createContext, useCallback } from 'react';

export const RecentViewContext = createContext(null);

export const RecentViewProvider = ({ children }) => {
  const [recentViewChange, setRecentViewChange] = useState(false);
  return (
    <RecentViewContext.Provider value={{ recentViewChange, setRecentViewChange }}>
      {children}
    </RecentViewContext.Provider>
  );
};
