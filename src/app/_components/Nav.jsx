import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex bg-red-300 justify-between">
      <h1>KEYNUT</h1>
      <ul>
        <div className="flex justify-end space-x-4">
          <li>
            <Link href="/search?c=keyboard">고객센터</Link>
          </li>
          <li>
            <Link href="/search?c=mouse">로그인</Link>
          </li>
          <li>
            <Link href="/search?c=keyboard">찜</Link>
          </li>
          <li>
            <Link href="/search?c=mouse">알림</Link>
          </li>
        </div>
        <div className="flex space-x-4">
          <li>GALLERY</li>
          <li>SHOP</li>
          <li>SEARCH</li>
          <li>CHAT</li>
        </div>
      </ul>
    </nav>
  );
}
