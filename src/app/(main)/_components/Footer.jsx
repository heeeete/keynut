'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const footer =
    (!pathname.startsWith('/bookmark') && !pathname.startsWith('/shop/') && !pathname.startsWith('/gallery')) ||
    pathname.startsWith('/shop/product');
  const footerRender = pathname.startsWith('/mypage');
  return (
    <>
      {footer ? (
        <div
          id="footer"
          className={`flex flex-col h-32 w-full border-t px-10 pt-6 mt-6 items-center space-y-4  max-md:px-5 ${
            footerRender ? 'max-md:hidden' : ''
          }`}
        >
          <p className="font-bold">KEYNUT</p>
          <p className="flex">
            <span className="font-semibold">Email :&nbsp;</span>
            <a href="mailto:helloword@na.com">keynut65@gmail.com</a>
          </p>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
