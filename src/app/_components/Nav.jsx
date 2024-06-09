'use client';

import Image from 'next/image';
import Link from 'next/link';
import Search from './Search';
import Add from './Add';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="w-full top-0 fixed nav-1280   max-md:nav-768 z-50"
      // style={{ boxShadow: '0 1px 5px -1px black' }}
    >
      <nav className="flex flex-col w-full h-full space-y-3 max-w-screen-xl mx-auto ">
        <ul className="flex justify-end pr-10 pt-2 max-md:pr-2">
          <div className="flex justify-end space-x-2 text-xs max-md:hidden">
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
              <Link href="/search?c=mouse">로그인</Link>
            </li>
          </div>
          {/* <div className="hidden justify-center items-center space-x-4 text-lg      max-md:flex">
            <li>
              <Link href={'/sell'}>
                <p className="p-2">
                  <svg
                    id="판매하기"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.6859 20.6926H4.92323C3.88605 20.6926 3.08773 19.8241 3.20716 18.8409L4.49579 8.32142C4.5775 7.63983 5.18096 7.12109 5.89756 7.12109H15.8168C16.5334 7.12109 17.1369 7.6338 17.2186 8.32142L17.91 14.0701"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M8.35938 9.35156V9.5868C8.35938 10.7751 9.47828 11.7462 10.8486 11.7462C12.219 11.7462 13.3379 10.7751 13.3379 9.5868V9.35156"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M7.35938 7.72983V6.25112C7.35938 4.34555 8.90414 2.80078 10.8097 2.80078V2.80078C12.7153 2.80078 14.26 4.34555 14.26 6.25112V7.72983"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M17.1179 22.4245C19.3694 22.4245 21.1968 20.5969 21.1968 18.347C21.1968 16.0972 19.3694 14.2695 17.1179 14.2695C14.8665 14.2695 13.0391 16.0972 13.0391 18.347C13.0391 20.5969 14.8665 22.4245 17.1179 22.4245Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M17.1406 19.9298V16.7461"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M15.5312 18.3439H18.7149"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </p>
              </Link>
            </li>
            <li className="flex justify-center items-center">
              <Search isMobile={true} />
            </li>
          </div> */}
        </ul>
        <div className="flex flex-col justify-center items-center space-y-5 bg-white">
          <div className="font-bold text-xl -rotate-3">KEYNUT</div>
          <ul className="">
            <div className="flex justify-end space-x-8 text-base max-md:hidden">
              <li>
                <Link
                  href={'/gallery'}
                  className={`${
                    pathname === '/gallery'
                      ? 'after:block after:w-full after:h-px after:absolute after:-rotate-12 after:top-1/2 after:bg-slate-950'
                      : ''
                  } relative`}
                >
                  GALLERY
                </Link>
              </li>
              <li>
                <Link href={'/shop'}>SHOP</Link>
              </li>
              <li>
                <Link href={'/chat'}>CHAT</Link>
              </li>
              <li>
                <Link href={'/post'}>POST</Link>
              </li>
              <li>
                <Link href={'/sell'}>SELL</Link>
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
