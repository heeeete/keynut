'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useNav } from '../_contexts/NavContext';

const CloseButton = () => {
  const { setNavStatus } = useNav();

  return (
    <div className="flex flex-col w-full">
      <button className="self-end p-2" onClick={() => setNavStatus(false)}>
        <img src="/admin/adminCloseNav.svg" alt="adminCloseNav" />
      </button>
    </div>
  );
};

const OpenButton = () => {
  const { setNavStatus } = useNav();

  return (
    <button className="p-3" onClick={() => setNavStatus(true)}>
      <img src="/admin/adminHamburger.svg" alt="adminHamburger" />
    </button>
  );
};

export default function Nav() {
  const pathname = usePathname();
  const { navStatus } = useNav();

  if (navStatus)
    return (
      <nav className="fixed max-w-72 w-full h-d-screen border z-40 bg-white">
        <CloseButton />
        <ul className="flex flex-col space-y-4 px-2">
          <span className="text-center font-semibold text-gray-400">유저 관리</span>
          <li>
            <Link
              href={'/admin/users'}
              className={`${pathname === '/admin/users' ? 'font-semibold' : 'text-gray-600'}`}
            >
              전체 유저
            </Link>
          </li>
          <li>
            <Link
              href={'/admin/suspended-users'}
              className={`${pathname === '/admin/suspended-users' ? 'font-semibold' : 'text-gray-600'}`}
            >
              정지 유저
            </Link>
          </li>
          <span className="text-center font-semibold text-gray-400">게시물 관리</span>
          <li>
            <Link
              href={'/admin/products'}
              className={`${pathname === '/admin/products' ? 'font-semibold' : 'text-gray-600'}`}
            >
              전체 게시물
            </Link>
          </li>
          <li>
            <Link
              href={'/admin/complaint-products'}
              className={`${pathname === '/admin/complaint-products' ? 'font-semibold' : 'text-gray-600'}`}
            >
              신고 게시물
            </Link>
          </li>
        </ul>
      </nav>
    );
  else
    return (
      <nav className="fixed w-14 h-full border-r">
        <OpenButton />
      </nav>
    );
}
