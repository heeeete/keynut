'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
              <Link href="/login">로그인</Link>
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
              <li>
                <Link
                  href={'/chat'}
                  className={`${
                    pathname.startsWith('/chat')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  CHAT
                </Link>
              </li>
            </div>
          </ul>
        </div>
        {/* {pathname === '/shop' ? (
          <div className="flex w-full justify-center items-center min-h-24 max-md:min-h-12 max-md:h-12 max-md:pt-2">
            <div className="flex rounded-none border-b-2 w-450 px-1 py-1 max-md:border-none max-md:rounded max-md:px-3 max-md:bg-gray-100 max-md:w-full max-md:h-full">
              <input
                type="text"
                placeholder="상품검색"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="outline-none w-450 pr-2 max-md:w-full max-md:bg-transparent"
              />
              {searchText.length ? (
                <button onClick={() => setSearchText('')}>
                  <svg
                    className=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.7em"
                    height="0.7em"
                    viewBox="0 0 2048 2048"
                  >
                    <path
                      fill="currentColor"
                      d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                    />
                  </svg>
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        ) : (
          ''
        )} */}
      </nav>
    </header>
  );
}
