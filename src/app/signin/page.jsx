'use client';
import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Nothing_You_Could_Do } from 'next/font/google';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState({});
  const [callbackUrl, setCallbackUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const url = searchParams.get('callbackUrl') || '/';
      setCallbackUrl(url);
    }
  }, []);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  useEffect(() => {
    if (session) return router.push('/');
  }, [session]);

  return (
    <div className="fixed top-0 left-0 z-50 bg-white w-100vw h-100vh flex flex-col space-y-14">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <div className="flex flex-col relative space-y-4 items-center">
          <span className={`${title.className} absolute -top-16 flex text-3xl justify-center`}>KEYNUT</span>
          {providers &&
            Object.values(providers).map(provider => (
              <button
                key={provider.name}
                style={{ boxShadow: '0px 1px 2px grey', borderRadius: '3px' }}
                onClick={() => signIn(provider.id, { callbackUrl })}
              >
                <Image
                  className="min-w-300"
                  src={`/${provider.id}Login.svg`}
                  width={350}
                  height={0}
                  alt={`${provider.name}Login`}
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
