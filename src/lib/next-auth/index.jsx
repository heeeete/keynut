'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useUser } from '@/app/(main)/_components/UserProvider';

const AuthProvider = ({ children }) => {
  const { user } = useUser();
  useEffect(() => {
    const initVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    if (user && user.device.type === 'mobile') {
      initVh();
      window.addEventListener('resize', initVh);
      return () => {
        window.removeEventListener('resize', initVh);
      };
    }
  }, [user]);
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
