'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';

import {
  Carter_One,
  Rock_Salt,
  Macondo,
  Monoton,
  Reenie_Beanie,
  Nothing_You_Could_Do,
  Rubik_Moonrocks,
  Protest_Revolution,
  Honk,
  Sixtyfour,
  Wallpoet,
  Skranji,
  Goldman,
  Red_Rose,
  Nosifer,
  Vujahday_Script,
  Nabla,
  Blaka_Ink,
} from 'next/font/google';

// const title = Carter_One({ subsets: ['latin'], weight: ['400'] });
// const title = Rock_Salt({ subsets: ['latin'], weight: ['400'] });
const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });
// const title = Rubik_Moonrocks({ subsets: ['latin'], weight: ['400'] });
// const title = Protest_Revolution({ subsets: ['latin'], weight: ['400'] });
// const title = Honk({ subsets: ['latin'], weight: ['400'] });
// const title = Sixtyfour({ subsets: ['latin'], weight: ['400'] });
// const title = Wallpoet({ subsets: ['latin'], weight: ['400'] });
// const title = Skranji({ subsets: ['latin'], weight: ['400'] });
// const title = Goldman({ subsets: ['latin'], weight: ['400'] });
// const title = Red_Rose({ subsets: ['latin'], weight: ['400'] });

export default function Nav() {
  const pathname = usePathname();
  const border =
    (!pathname.startsWith('/gallery') && !pathname.startsWith('/shop')) ||
    pathname.startsWith('/shop/product') ||
    pathname.startsWith('/gallery/post');
  const navRender = pathname === '/shop' || pathname === '/gallery';
  const { data: session } = useSession();

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
              <Link href="/mypage">마이페이지</Link>
            </li>
            <li>
              <Link href="/search?c=mouse">알림</Link>
            </li>
            <li>
              <Link href="/bookmark">찜</Link>
            </li>
            <li>
              {session ? (
                <button onClick={() => signOut()}>로그아웃</button>
              ) : (
                <button onClick={() => signIn()}>로그인</button>
              )}
              {/* <Link href="/login">{session ? '로그아웃' : '로그인'}</Link> */}
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
                <Link
                  href={'/sell'}
                  className={`${
                    pathname.startsWith('/sell')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  SELL
                </Link>
              </li>
              <li>
                <Link
                  href={'/post'}
                  className={`${
                    pathname.startsWith('/post')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  POST
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
}
