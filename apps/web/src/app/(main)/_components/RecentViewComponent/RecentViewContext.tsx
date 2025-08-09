'use client';
import React, { useState, createContext } from 'react';

interface RecentViewContextType {
  recentViewChange: boolean;
  setRecentViewChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RecentViewContext = createContext<RecentViewContextType | null>(null);

export const RecentViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [recentViewChange, setRecentViewChange] = useState(false);
  return (
    <RecentViewContext.Provider value={{ recentViewChange, setRecentViewChange }}>
      {children}
    </RecentViewContext.Provider>
  );
};
