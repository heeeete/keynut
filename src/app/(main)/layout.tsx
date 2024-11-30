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
