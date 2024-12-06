import './globals.css';
import { ReactNode } from 'react';
import { Suspense } from 'react';
import Header from './_components/Header';
import Nav from './_components/Nav';
import { NavProvider } from './_contexts/NavContext';
import RQProvider from './_components/RQProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RQProvider>
          <Header />
          <div className="flex pt-10">
            <NavProvider>
              <Nav />
              <Suspense>
                <div className="flex w-full">{children}</div>
              </Suspense>
            </NavProvider>
          </div>
        </RQProvider>
      </body>
    </html>
  );
}
