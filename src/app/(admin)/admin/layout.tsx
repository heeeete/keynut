import { Suspense } from 'react';
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
          <Suspense>
            <div className="flex w-full">{children}</div>
          </Suspense>
        </NavProvider>
      </div>
    </div>
  );
}
