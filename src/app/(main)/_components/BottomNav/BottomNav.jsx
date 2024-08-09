'use client';
import BookmarkLink from './BookmarkLink';
import HomeLink from './HomeLink';
import ShopLink from './ShopLink';
import SellLink from './SellLink';
import MyPageLink from './MyPageLink';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import handleLogin from '@/utils/handleLogin';

export default function BottomNav() {
  const router = useRouter();
  return (
    <nav className="hidden fixed z-40 border-t w-full max-w-screen-xl  bg-white justify-between bottom-nav-calc-height pb-safe-bottom bottom-0 left-1/2 -translate-x-1/2     max-md:flex ">
      <ul className="flex w-full justify-around items-center">
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <HomeLink />
          <p className="text-xxs -translate-y-1">HOME</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <ShopLink />
          <p className="text-xxs -translate-y-1">SHOP</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <SellLink router={router} />
          <p className="text-xxs -translate-y-1">SELL</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <BookmarkLink router={router} />
          <p className="text-xxs -translate-y-1">찜</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <MyPageLink router={router} />
          <Link href="/mypage" onClick={e => handleLogin(e, router, '/mypage')} className="text-xxs -translate-y-1">
            MY
          </Link>
        </li>
      </ul>
    </nav>
  );
}
