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
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <ShopLink />
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <SellLink router={router} />
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <BookmarkLink router={router} />
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1">
          <MyPageLink router={router} />
        </li>
      </ul>
    </nav>
  );
}
