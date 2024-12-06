'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import handleLogin from '@/utils/handleLogin';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function BookmarkLink({ router }: { router: AppRouterInstance }) {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/bookmark' ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <path
              fill="black"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0z"
            />
          </svg>
          <p className="text-xxs">찜</p>
        </div>
      ) : (
        <Link
          href={'/bookmark'}
          onClick={(e) => handleLogin(e, router, '/bookmark')}
          className="flex flex-col justify-center items-center w-full h-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0z"
            />
          </svg>
          <p className="text-xxs">찜</p>
        </Link>
      )}
    </>
  );
}
