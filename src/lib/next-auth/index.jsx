'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { isMobile } from '../isMobile';

const AuthProvider = ({ children }) => {
  useEffect(() => {
    const initVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    if (isMobile()) {
      console.log('MOBILE INIT');
      window.addEventListener('resize', initVh);
      return () => {
        window.removeEventListener('resize', initVh);
      };
    }
  }, []);
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
