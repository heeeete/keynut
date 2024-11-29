import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';
import Modal from './_components/Modal';
import RecentlyViewedProducts from './_components/RightBar';
import { RecentViewProvider } from './_components/RecentViewComponent/RecentViewContext';
import RightBar from './_components/RightBar';
import Image from 'next/image';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <Nav />
      <RecentViewProvider>
        <div className="relative main-1280 max-[960px]:pt-0">{children}</div>
        <RightBar />
      </RecentViewProvider>
      <Footer />
      <BottomNav />
      <Modal />

      {/* 크리스마스 트리! */}
      <div className="fixed -bottom-7 left-24 -z-10 opacity-35 max-[960px]:bottom-3">
        <Image src="/christmas/tree.png" width={300} height={1} alt="tree" />
      </div>
    </ModalProvider>
  );
}
