import Footer from './_components/Footer';
import BottomNav from './_components/BottomNav/BottomNav';
import Nav from './_components/Nav';

export default function MainLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="relative main-1280 max-md:pt-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
