'use client';

import { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export function NavProvider({ children }) {
  const [navStatus, setNavStatus] = useState(true);

  return <NavContext.Provider value={{ navStatus, setNavStatus }}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);
