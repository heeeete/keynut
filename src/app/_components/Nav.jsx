import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex fixed w-full max-w-screen-xl px-10 bg-white justify-between h-20 top-0  left-1/2 -translate-x-1/2 max-md:px-0 max-md:h-14">
      <div className="flex relative w-32 ">
        <Link href={'/'}>
          <Image
            className="flex justify-start"
            style={{ objectFit: 'contain' }}
            src={'/logo.png'}
            alt="logo"
            fill
            sizes="(max-width: 768px) 10vw, 100vw, 33vw"
          />
        </Link>
      </div>
      <ul className=" flex flex-col justify-around max-md:hidden">
        <div className="flex justify-end space-x-8 text-xs">
          <li>
            <Link href="/search?c=keyboard">고객센터</Link>
          </li>
          <li>
            <Link href="/search?c=keyboard">마이페이지</Link>
          </li>
          <li>
            <Link href="/search?c=mouse">알림</Link>
          </li>
          <li>
            <Link href="/search?c=keyboard">찜</Link>
          </li>
          <li>
            <Link href="/search?c=mouse">로그인</Link>
          </li>
        </div>
        <div className="flex justify-end space-x-8  text-lg">
          <li>
            <Link href={'/gallery'}>GALLERY</Link>
          </li>
          <li>
            <Link href={'/shop'}>SHOP</Link>
          </li>
          <li>
            <Link href={'/search'}>SEARCH</Link>
          </li>
          <li>
            <Link href={'/chat'}>CHAT</Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
