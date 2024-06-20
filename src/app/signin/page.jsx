'use client';
import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Nothing_You_Could_Do } from 'next/font/google';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

export default function SignIn() {
  const [providers, setProviders] = useState({});
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 bg-white w-100vw h-100vh flex flex-col space-y-14">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <div className="flex flex-col relative space-y-4 items-center">
          <span className={`${title.className} absolute -top-16 flex text-3xl justify-center`}>KEYNUT</span>
          <button
            style={{ boxShadow: '0px 1px 2px grey', borderRadius: '3px' }}
            onClick={() => signIn('kakao', { callbackUrl })}
          >
            <Image src="/kakaoLogin.svg" width={350} height={0} alt="kakaoLogin" />
          </button>
          <button
            style={{ boxShadow: '0px 1px 2px grey', borderRadius: '3px' }}
            onClick={() => signIn('google', { callbackUrl })}
          >
            <Image src="/googleLogin.svg" width={350} height={0} alt="googleLogin" />
          </button>
        </div>
      </div>
    </div>
  );
}
