'use client';
import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Nothing_You_Could_Do } from 'next/font/google';
import Link from 'next/link';

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
    <div className="fixed top-0 left-0 z-50 bg-white w-100vw h-100vh flex flex-col space-y-14 items-center justify-center">
      <div className="flex flex-col gap-y-4 relative p-2">
        <Link href={'/'}>
          <span
            className={`${title.className} absolute -top-20 left-1/2 -translate-x-1/2 flex text-3xl justify-center cursor-pointer`}
          >
            KEYNUT
          </span>
        </Link>
        {providers &&
          Object.values(providers).map(provider => (
            <button key={provider.name} onClick={() => signIn(provider.id, { callbackUrl })}>
              <Image
                className="min-w-250"
                src={`/${provider.id}Login.svg`}
                width={350}
                height={0}
                alt={`${provider.name}Login`}
              />
            </button>
          ))}
      </div>
    </div>
  );
}
