import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';
import Modal from './_components/Modal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <Nav />
      <div className="relative main-1280 max-[960px]:pt-0">{children}</div>
      <Footer />
      <BottomNav />
      <Modal />
    </ModalProvider>
  );
}
