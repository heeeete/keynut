import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/lib/next-auth';
import RQProvider from './(main)/_components/RQProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KEYNUT',
  description: '키보드, 마우스, 헤드셋, 모니터등 다양한 전자기기를 한눈에',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className + 'flex flex-col justify-center items-center max-md:mb-bottom-nav-height'}>
        <RQProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </RQProvider>
      </body>
    </html>
  );
}
