'use client';

import React, { useContext, createContext, useState, useEffect, ReactNode } from 'react';

interface UserAgent {
  isBot: boolean;
  ua: string;
  browser: {
    name?: string;
    version?: string;
  };
  device: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  cpu: {
    architecture?: string;
  };
}

interface UserProviderProps {
  children: ReactNode;
  initialUser: UserAgent;
}

interface UserContextType {
  user: UserAgent;
  setUser: React.Dispatch<React.SetStateAction<UserAgent>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
  const [user, setUser] = useState<UserAgent>(initialUser);

  useEffect(() => {
    const isIPad = initialUser.device.model === 'Macintosh' && navigator.maxTouchPoints >= 1;

    setUser({
      ...initialUser,
      device: {
        ...initialUser.device,
        type: initialUser.device?.type || (isIPad ? 'mobile' : 'desktop'), // 기본값으로 'desktop' 설정
      },
    });
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
