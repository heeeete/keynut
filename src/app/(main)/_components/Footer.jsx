'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  const footer = !pathname.startsWith('/bookmark') && !pathname.startsWith('/gallery');
  const footerRender =
    pathname.startsWith('/mypage') ||
    pathname === '/sell' ||
    (pathname.startsWith('/shop/') && !pathname.startsWith('/shop/product/'));
  return (
    <>
      {footer ? (
        <div
          id="footer"
          className={`flex flex-col   w-full border-t px-10 py-2 mt-6 items-center justify-center space-y-3  max-[960px]:px-5 ${
            footerRender ? 'max-[960px]:hidden' : ''
          }`}
        >
          <p className="font-bold">KEYNUT</p>
          <div className="flex flex-col items-center max-w-screen-xl w-full px-10 space-y-2">
            <p className="flex text-sm text-gray-600">
              <a href="mailto:helloword@na.com">keynut65@gmail.com</a>
            </p>
            <div className="flex">
              <Link href="https://www.instagram.com/keynut_official/" aria-label="keynut instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <g
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    color="black"
                  >
                    <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
                    <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
