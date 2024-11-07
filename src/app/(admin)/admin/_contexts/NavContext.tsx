'use client';

import { createContext, useContext, useState } from 'react';

interface NavContextType {
  navStatus: boolean;
  setNavStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }) {
  const [navStatus, setNavStatus] = useState(true);

  return <NavContext.Provider value={{ navStatus, setNavStatus }}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);
