'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';
import handleLogin from '../../../utils/handleLogin';
import { Nothing_You_Could_Do } from 'next/font/google';

const title = Nothing_You_Could_Do({ subsets: ['latin'], weight: ['400'] });

export default function Nav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const border =
    (!pathname.startsWith('/gallery') && !pathname.startsWith('/shop')) ||
    pathname.startsWith('/shop/') ||
    pathname.startsWith('/gallery/post');
  const navRender =
    pathname === '/shop' || pathname === '/gallery' || pathname === '/bookmark' || pathname === '/mypage/profile-edit';

  const maxMdBorder = pathname.startsWith('/mypage/product-edit');

  return (
    <header
      id="nav"
      className={`${border ? 'border-b' : ''} ${
        navRender ? 'max-[960px]:hidden' : ''
      } fixed w-full top-0 bg-white z-50 ${maxMdBorder ? 'max-[960px]:border-0' : ''}`}
    >
      <nav className="flex flex-col w-full h-full  max-w-screen-xl mx-auto max-[960px]:space-y-0">
        <div className="flex justify-end pr-10 pt-2 max-[960px]:hidden">
          <ul className="flex justify-end space-x-2 text-xs">
            {/* <li>
              <Link href="/search?c=keyboard">고객센터</Link>
            </li> */}
            <li>
              <Link href="/mypage" onClick={e => handleLogin(e, router, '/mypage')}>
                마이페이지
              </Link>
            </li>
            {/* <li>
              <Link href="/search?c=mouse">알림</Link>
            </li> */}
            <li>
              <Link href="/bookmark" onClick={e => handleLogin(e, router, '/bookmark')}>
                찜
              </Link>
            </li>
            <li>
              {status === 'loading' ? (
                '인증중'
              ) : session ? (
                <button onClick={() => signOut()}>로그아웃</button>
              ) : (
                <button onClick={() => signIn()}>로그인</button>
              )}
            </li>
          </ul>
        </div>
        <div className="flex flex-col pb-2 items-center space-y-5 max-[960px]:space-y-0 max-[960px]:py-2">
          <div className="flex font-bold text-3xl items-center rounded justify-center max-[960px]:text-2xl max-[960px]:w-28">
            <Link className="flex w-full justify-center" href={'/'}>
              <p className={`${title.className}`}>KEYNUT</p>
            </Link>
          </div>
          <div className="">
            <ul className="flex justify-end space-x-8 text-base max-[960px]:hidden">
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
                  onClick={e => handleLogin(e, router, '/sell')}
                  className={`${
                    pathname.startsWith('/sell')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  SELL
                </Link>
              </li>
              {/* <li>
                <Link
                  href={'/post'}
                  onClick={e => handleLogin(e, router, '/post')}
                  className={`${
                    pathname.startsWith('/post')
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  POST
                </Link>
              </li> */}
              {session?.admin && (
                <>
                  <li>
                    <Link href={'/admin'}>ADMIN</Link>
                  </li>
                </>
              )}
              {/* <li>
                <Link href={'/price'}>시세</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
