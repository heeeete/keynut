import Header from './_components/Header';
import Nav from './_components/Nav';
import { NavProvider } from './_contexts/NavContext';

export default function AdminLayout({ children }) {
  return (
    <div className="">
      <Header />
      <div className="flex pt-10">
        <NavProvider>
          <Nav />
          <div className="flex w-full">{children}</div>
        </NavProvider>
      </div>
    </div>
  );
}
