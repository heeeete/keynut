import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';
import Modal from './_components/Modal';
import RecentlyViewedProducts from './_components/RightBar';
import { RecentViewProvider } from './_components/RecentViewComponent/RecentViewContext';
import RightBar from './_components/RightBar';
import Image from 'next/image';
import { ModelViewerProvider } from './_components/ModelViewerComponent/ModelViewerContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {/* 크리스마스! */}
      <Image
        src="/christmas/a.png"
        draggable={false}
        width={100}
        height={1}
        alt="a"
        className="z-80 -top-2 -left-2 fixed max-md:w-20"
      />
      <Nav />
      <ModelViewerProvider>
        <RecentViewProvider>
          <div className="relative main-1280 max-[960px]:pt-0">{children}</div>
          <RightBar />
        </RecentViewProvider>
      </ModelViewerProvider>
      <Footer />
      <BottomNav />
      <Modal />
    </ModalProvider>
  );
}
