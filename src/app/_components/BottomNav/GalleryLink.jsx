'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function GalleryLink() {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/gallery' ? (
        <div className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 36 36">
            <path
              fill="black"
              d="M30.14 3a1 1 0 0 0-1-1h-22a1 1 0 0 0-1 1v1h24Z"
              className="clr-i-solid clr-i-solid-path-1"
            />
            <path
              fill="black"
              d="M32.12 7a1 1 0 0 0-1-1h-26a1 1 0 0 0-1 1v1h28Z"
              className="clr-i-solid clr-i-solid-path-2"
            />
            <path
              fill="black"
              d="M32.12 10H3.88A1.88 1.88 0 0 0 2 11.88v18.24A1.88 1.88 0 0 0 3.88 32h28.24A1.88 1.88 0 0 0 34 30.12V11.88A1.88 1.88 0 0 0 32.12 10M8.56 13.45a3 3 0 1 1-3 3a3 3 0 0 1 3-3M30 28H6l7.46-7.47a.71.71 0 0 1 1 0l3.68 3.68L23.21 19a.71.71 0 0 1 1 0L30 24.79Z"
              className="clr-i-solid clr-i-solid-path-3"
            />
            <path fill="none" d="M0 0h36v36H0z" />
          </svg>
        </div>
      ) : (
        <Link href={'/gallery'} className="flex justify-center items-center w-full h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 36 36">
            <path
              fill="black"
              d="M32.12 10H3.88A1.88 1.88 0 0 0 2 11.88v18.24A1.88 1.88 0 0 0 3.88 32h28.24A1.88 1.88 0 0 0 34 30.12V11.88A1.88 1.88 0 0 0 32.12 10M32 30H4V12h28Z"
              className="clr-i-outline clr-i-outline-path-1"
            />
            <path
              fill="black"
              d="M8.56 19.45a3 3 0 1 0-3-3a3 3 0 0 0 3 3m0-4.6A1.6 1.6 0 1 1 7 16.45a1.6 1.6 0 0 1 1.56-1.6"
              className="clr-i-outline clr-i-outline-path-2"
            />
            <path
              fill="black"
              d="m7.9 28l6-6l3.18 3.18L14.26 28h2l7.46-7.46L30 26.77v-2L24.2 19a.71.71 0 0 0-1 0l-5.16 5.16l-3.67-3.66a.71.71 0 0 0-1 0L5.92 28Z"
              className="clr-i-outline clr-i-outline-path-3"
            />
            <path
              fill="black"
              d="M30.14 3a1 1 0 0 0-1-1h-22a1 1 0 0 0-1 1v1h24Z"
              className="clr-i-outline clr-i-outline-path-4"
            />
            <path
              fill="black"
              d="M32.12 7a1 1 0 0 0-1-1h-26a1 1 0 0 0-1 1v1h28Z"
              className="clr-i-outline clr-i-outline-path-5"
            />
            <path fill="none" d="M0 0h36v36H0z" />
          </svg>
        </Link>
      )}
    </>
  );
}
