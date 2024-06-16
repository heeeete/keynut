'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';
import handleLogin from '../utils/handleLogin';
import { Nothing_You_Could_Do } from 'next/font/google';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

export default function Nav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const border =
    (!pathname.startsWith('/gallery') && !pathname.startsWith('/shop')) ||
    pathname.startsWith('/shop/product') ||
    pathname.startsWith('/gallery/post');
  const navRender = pathname === '/shop' || pathname === '/gallery';

  return (
    <header
      className={`${border ? 'border-b' : ''} ${navRender ? 'max-md:hidden' : ''} fixed w-full top-0 bg-white z-50`}
    >
      <nav className="flex flex-col w-full h-full  max-w-screen-xl mx-auto max-md:space-y-0">
        <ul className="flex justify-end pr-10 pt-2 max-md:hidden">
          <div className="flex justify-end space-x-2 text-xs">
            <li>
              <Link href="/search?c=keyboard">고객센터</Link>
            </li>
            <li>
              <Link href="/mypage" onClick={e => handleLogin(e, router, session, '/mypage')}>
                마이페이지
              </Link>
            </li>
            <li>
              <Link href="/search?c=mouse">알림</Link>
            </li>
            <li>
              <Link href="/bookmark" onClick={e => handleLogin(e, router, session, '/bookmark')}>
                찜
              </Link>
            </li>
            <li>
              {session ? (
                <button onClick={() => signOut()}>로그아웃</button>
              ) : (
                <button onClick={() => signIn()}>로그인</button>
              )}
            </li>
          </div>
        </ul>
        <div className="flex flex-col pb-2 items-center space-y-5 max-md:space-y-0 max-md:py-2">
          <div className="font-bold text-3xl">
            <Link href={'/'}>
              <p className={`${title.className}`}>KEYNUT</p>
            </Link>
          </div>
          <ul className="">
            <div className="flex justify-end space-x-8 text-base max-md:hidden">
              <li>
                <Link
                  href={'/gallery'}
                  className={`${
                    pathname.startsWith('/gallery')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  GALLERY
                </Link>
              </li>
              <li>
                <Link
                  href={'/shop'}
                  className={`${
                    pathname.startsWith('/shop')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  SHOP
                </Link>
              </li>
              <li>
                <a
                  href={'/sell'}
                  className={`${
                    pathname.startsWith('/sell')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  SELL
                </a>
              </li>
              <li>
                <a
                  href={'/post'}
                  onClick={e => handleLogin(e, router, session, '/post')}
                  className={`${
                    pathname.startsWith('/post')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  POST
                </a>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
}
