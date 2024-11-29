import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';
import Modal from './_components/Modal';
import RecentlyViewedProducts from './_components/RightBar';
import { RecentViewProvider } from './_components/RecentViewComponent/RecentViewContext';
import RightBar from './_components/RightBar';

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
    </ModalProvider>
  );
}
