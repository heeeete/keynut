import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';

export default function MainLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="relative main-1280 max-md:pt-0">{children}</div>
      <Footer />
      <BottomNav />
    </>
  );
}
