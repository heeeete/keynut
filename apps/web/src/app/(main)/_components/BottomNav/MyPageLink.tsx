'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import handleLogin from '@/utils/handleLogin';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function MyPageLink({ router }: { router: AppRouterInstance }) {
  const pathName = usePathname();
  return (
    <>
      {pathName.startsWith('/mypage') ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16">
            <path
              fill="black"
              d="M3 14s-1 0-1-1s1-4 6-4s6 3 6 4s-1 1-1 1zm5-6a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
            />
          </svg>
          <p className="text-xxs">MY</p>
        </div>
      ) : (
        <Link
          href={'/mypage'}
          onClick={(e) => handleLogin(e, router, '/mypage')}
          className="flex flex-col justify-center items-center w-full h-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16">
            <path
              fill="black"
              d="M8 8a3 3 0 1 0 0-6a3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0a2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1s1-4 6-4s6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
            />
          </svg>
          <p className="text-xxs">MY</p>
        </Link>
      )}
    </>
  );
}
