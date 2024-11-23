'use client';

import { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext(undefined);

export const UserProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isIPad = initialUser.device.model === 'Macintosh' && navigator.maxTouchPoints >= 1;

    setUser({
      ...initialUser,
      device: {
        ...initialUser.device,
        type: initialUser.device.type || (isIPad ? 'mobile' : 'desktop'), // 기본값으로 'desktop' 설정
      },
    });
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
