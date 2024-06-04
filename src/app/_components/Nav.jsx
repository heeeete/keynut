import Image from 'next/image';
import Link from 'next/link';
import Search from './Search';
import Add from './Add';

export default function Nav() {
  return (
    <header
      className="w-full top-0 fixed  bg-white nav-1280  max-md:nav-768 z-50"
      style={{ boxShadow: '0 1px 5px -1px black' }}
    >
      <nav className="flex w-full h-full max-w-screen-xl mx-auto  justify-between">
        <div className="pl-10 w-40 max-md:pl-2 max-md:w-28">
          <div className="flex relative  w-full h-full">
            <Link href={'/'}>
              <Image className="" style={{ objectFit: 'contain' }} src={'/logo.png'} alt="logo" fill />
            </Link>
          </div>
        </div>
        <ul className=" flex flex-col justify-around  pr-10">
          <div className="flex justify-end space-x-8 text-xs max-md:hidden">
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
              <Link href="/search?c=keyboard">찜</Link>
            </li>
            <li>
              <Link href="/search?c=mouse">로그인</Link>
            </li>
          </div>
          <div className="flex justify-end space-x-8  text-lg max-md:hidden">
            <li>
              <Link href={'/gallery'}>GALLERY</Link>
            </li>
            <li>
              <Link href={'/shop'}>SHOP</Link>
            </li>
            <li>
              <Search isMobile={false} />
            </li>
            <li>
              <Link href={'/chat'}>CHAT</Link>
            </li>
            <li className="relative">
              <Add />
            </li>
          </div>

          <div className="hidden justify-center items-center space-x-8 text-lg      max-md:flex">
            <li>
              <Link href={'/sell'}>판매하기</Link>
            </li>
            <li className="flex justify-center items-center">
              <Search isMobile={true} />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
