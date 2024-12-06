'use client';
import { usePathname } from 'next/navigation';
import handleLogin from '@/utils/handleLogin';
import Link from 'next/link';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function SellLink({ router }: { router: AppRouterInstance }) {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/sell' ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div
            className="flex items-center justify-center rounded-full bg-black border-2 border-black scale-90"
            style={{ width: '2em', height: '2em' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={1}
            >
              <path
                fill="white"
                d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
              />
            </svg>
          </div>
          <p className="text-xxs">SELL</p>
        </div>
      ) : (
        <Link
          href={'/sell'}
          onClick={(e) => handleLogin(e, router, '/sell')}
          className="flex flex-col justify-center items-center w-full h-full"
        >
          <div
            className="flex items-center justify-center rounded-full border-2 border-black scale-90"
            style={{ width: '2em', height: '2em' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth={1}
            >
              <path
                fill="currentColor"
                d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
              />
            </svg>
          </div>
          <p className="text-xxs">SELL</p>
        </Link>
      )}
    </>
  );
}
