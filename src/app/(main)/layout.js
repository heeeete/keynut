import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';
import { ModalProvider } from './_components/ModalProvider';

export default function MainLayout({ children }) {
  return (
    <ModalProvider>
      <Nav />
      <div className="relative main-1280 max-md:pt-0">{children}</div>
      <Footer />
      <BottomNav />
    </ModalProvider>
  );
}
