'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NavContextType {
  navStatus: boolean;
  setNavStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [navStatus, setNavStatus] = useState(true);

  return <NavContext.Provider value={{ navStatus, setNavStatus }}>{children}</NavContext.Provider>;
}

export const useNav = (): NavContextType => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
