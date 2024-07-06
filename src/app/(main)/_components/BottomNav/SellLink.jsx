'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SellLink() {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/sell' ? (
        <div className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"
            />
          </svg>
        </div>
      ) : (
        <Link href={'/sell'} className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 16 16">
            <g fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </g>
          </svg>
        </Link>
      )}
    </>
  );
}