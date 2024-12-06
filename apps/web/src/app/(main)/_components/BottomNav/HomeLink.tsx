'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function HomeLink() {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/' ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 28 28">
            <path
              fill="black"
              d="M15.408 3.498a2.25 2.25 0 0 0-2.816 0l-7.75 6.217A2.25 2.25 0 0 0 4 11.47v11.28A2.25 2.25 0 0 0 6.25 25h2.5A2.25 2.25 0 0 0 11 22.75v-5.5c0-.69.56-1.25 1.25-1.25h3.5c.69 0 1.25.56 1.25 1.25v5.5A2.25 2.25 0 0 0 19.25 25h2.5A2.25 2.25 0 0 0 24 22.75V11.47a2.25 2.25 0 0 0-.842-1.755z"
            />
          </svg>
          <p className="text-xxs">HOME</p>
        </div>
      ) : (
        <Link href={'/'} className="flex flex-col justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 28 28">
            <path
              fill="black"
              d="M12.592 3.495a2.25 2.25 0 0 1 2.816 0l7.75 6.218A2.25 2.25 0 0 1 24 11.468v11.28a2.25 2.25 0 0 1-2.25 2.25h-3a2.25 2.25 0 0 1-2.25-2.25v-6a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v6a2.25 2.25 0 0 1-2.25 2.25h-3A2.25 2.25 0 0 1 4 22.749v-11.28c0-.682.31-1.328.842-1.755zm1.877 1.17a.75.75 0 0 0-.938 0l-7.75 6.218a.75.75 0 0 0-.281.585v11.28c0 .415.336.75.75.75h3a.75.75 0 0 0 .75-.75v-6a2.25 2.25 0 0 1 2.25-2.25h3.5a2.25 2.25 0 0 1 2.25 2.25v6c0 .415.336.75.75.75h3a.75.75 0 0 0 .75-.75v-11.28a.75.75 0 0 0-.28-.585z"
            />
          </svg>
          <p className="text-xxs">HOME</p>
        </Link>
      )}
    </>
  );
}
