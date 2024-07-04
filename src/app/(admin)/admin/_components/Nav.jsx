'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed max-w-72 w-full h-d-screen border z-50 bg-white">
      <ul className="flex flex-col space-y-4">
        <span className="text-center font-semibold text-gray-400">유저 관리</span>
        <li>
          <Link href={'/admin/users'} className={`${pathname === '/admin/users' ? 'font-semibold' : 'text-gray-600'}`}>
            전체 유저
          </Link>
        </li>
        <li>
          <Link
            href={'/admin/suspended-users'}
            className={`${pathname === '/suspended-users' ? 'font-semibold' : 'text-gray-600'}`}
          >
            정지 유저
          </Link>
        </li>
        <span className="text-center font-semibold text-gray-400">게시물 관리</span>
        <li>
          <Link href={'/admin/products'} className={`${pathname === '/products' ? 'font-semibold' : 'text-gray-600'}`}>
            전체 게시물
          </Link>
        </li>
        <li>
          <Link
            href={'/admin/complaint-products'}
            className={`${pathname === 'complaint-products' ? 'font-semibold' : 'text-gray-600'}`}
          >
            신고 게시물
          </Link>
        </li>
      </ul>
    </nav>
  );
}
