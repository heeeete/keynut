'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ShopLink() {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/shop' ? (
        <div className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 20 20">
            <path
              fill="black"
              fillRule="evenodd"
              d="M10 2a4 4 0 0 0-4 4v1H5a1 1 0 0 0-.994.89l-1 9A1 1 0 0 0 4 18h12a1 1 0 0 0 .994-1.11l-1-9A1 1 0 0 0 15 7h-1V6a4 4 0 0 0-4-4m2 5V6a2 2 0 1 0-4 0v1zm-6 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0m7-1a1 1 0 1 0 0 2a1 1 0 0 0 0-2"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <Link href={'/shop'} className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4z"
            />
          </svg>
        </Link>
      )}
    </>
  );
}
