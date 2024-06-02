import BookmarkLink from './BookmarkLink';
import HomeLink from './HomeLink';
import ShopLink from './ShopLink';
import GalleryLink from './GalleryLink';
import MyPageLink from './MyPageLink';

export default function BottomNav() {
  return (
    <nav className="hidden fixed z-40 border-t w-full max-w-screen-xl  bg-white justify-between bottom-nav-calc-height pb-safe-bottom bottom-0 left-1/2 -translate-x-1/2     max-md:flex ">
      <ul className="flex w-full justify-around items-center">
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-3">
          <HomeLink />
          <p className="text-xxs">HOME</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-3">
          <GalleryLink />
          <p className="text-xxs">GALLERY</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-3">
          <ShopLink />
          <p className="text-xxs">SHOP</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-3">
          <BookmarkLink />
          <p className="text-xxs">찜</p>
        </li>
        <li className="flex flex-col justify-center items-center h-full flex-1 -space-y-3">
          <MyPageLink />
          <p className="text-xxs">MY</p>
        </li>
      </ul>
    </nav>
  );
}
