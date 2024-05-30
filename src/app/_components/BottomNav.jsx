import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="hidden fixed w-full max-w-screen-xl  bg-white justify-between h-14 bottom-0  left-1/2 -translate-x-1/2 max-md:flex border-t">
      <ul className="flex w-full justify-around items-center">
        <li>HOME</li>
        <li>GALLERY</li>
        <li>SHOP</li>
        <li>찜</li>
        <li>MY</li>
      </ul>
    </nav>
  );
}
