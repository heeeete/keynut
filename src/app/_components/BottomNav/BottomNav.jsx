import BookmarkLink from './BookmarkLink';
import HomeLink from './HomeLink';
import ShopLink from './ShopLink';
import GalleryLink from './GalleryLink';
import MyPageLink from './MyPageLink';

export default function Nav() {
  return (
    <nav className="hidden fixed w-full max-w-screen-xl  bg-white justify-between h-14 bottom-0  left-1/2 -translate-x-1/2 max-md:flex border-t z-40">
      <ul className="flex w-full justify-around items-center">
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-1">
          <HomeLink />
          <p className="text-xs">HOME</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-1">
          <GalleryLink />
          <p className="text-xs">GALLERY</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-1">
          <ShopLink />
          <p className="text-xs">SHOP</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-1">
          <BookmarkLink />
          <p className="text-xs">찜</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-1">
          <MyPageLink />
          <p className="text-xs">MY</p>
        </li>
      </ul>
    </nav>
  );
}
