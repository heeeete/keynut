// components/SignIn.js
'use client';
import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { Roboto } from 'next/font/google';
import Image from 'next/image';

const title = Roboto({ subsets: ['latin'], weight: ['500'] });

export default function SignIn() {
  const [providers, setProviders] = useState({});

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  return (
    <div className="flex flex-col space-y-10 items-center justify-center max-w-screen-xl mx-auto px-10 h-80vh max-md:px-2 max-md:100vh">
      <span className="flex text-xl">Login</span>
      <div className="flex flex-col space-y-4 items-center">
        <button
          style={{ boxShadow: '0px 1px 2px grey', borderRadius: '3px' }}
          onClick={() => signIn('kakao', { callbackUrl: '/' })}
        >
          <Image src="/kakaoLogin.svg" width={350} height={0} alt="kakaoLogin" />
        </button>
        <button
          style={{ boxShadow: '0px 1px 2px grey', borderRadius: '3px' }}
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <Image src="/googleLogin.svg" width={350} height={0} alt="googleLogin" />
        </button>
      </div>
    </div>
  );
}
