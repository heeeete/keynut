'use client';
import Image from 'next/image';
import RecentViewProducts from './RecentViewComponent/RecentViewProducts';
import { usePathname } from 'next/navigation';

const ScrollToTopBtn = () => {
  return (
    <button
      className="flex justify-center items-center p-2 border rounded-md bg-white  border-gray-300 max-[960px]:rounded-full max-[960px]:opacity-65"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <p className="max-[960px]:hidden">TOP</p>
      <Image
        className="min-[960px]:hidden"
        src="/arrowTop.svg"
        alt="arrowTop"
        width={20}
        height={20}
      />
    </button>
  );
};

const RightBar = () => {
  const pathname = usePathname();
  const isRenderablePath = !pathname.startsWith('/sell') && !pathname.startsWith('/auth');

  if (!isRenderablePath) return;
  return (
    <div className="flex flex-col fixed z-50  space-y-3 max-[960px]:right-2 max-[960px]:bottom-14 min-[960px]:right-0 min-[960px]:bottom-2">
      <RecentViewProducts />
      <ScrollToTopBtn />
    </div>
  );
};

export default RightBar;
