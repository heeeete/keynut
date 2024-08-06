import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/lib/next-auth';
import RQProvider from './(main)/_components/RQProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KEYNUT',
  description: '키보드, 마우스, 헤드셋, 모니터등 다양한 전자기기를 한눈에',
  openGraph: {
    title: 'KEYNUT',
    description: '키보드, 마우스, 헤드셋, 모니터등 다양한 전자기기를 한눈에',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`, // 이미지의 절대 URL
        width: 500,
        height: 500,
        alt: 'KEYNUT Logo',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      {/* <body className={inter.className + 'custom-body flex flex-col justify-center items-center'}> */}
      <body className={`${inter.className} custom-body`}>
        <RQProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </RQProvider>
      </body>
    </html>
  );
}
