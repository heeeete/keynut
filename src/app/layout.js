import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/lib/next-auth';
import RQProvider from './(main)/_components/RQProvider';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#ffffff',
};

export const metadata = {
  title: 'KEYNUT - 키넛',
  description: '키보드, 마우스, 헤드셋, 모니터등 다양한 전자기기를 한눈에',
  // manifest: '/manifest.json',
  // icons: [
  //   { rel: 'icon', url: '/keynut.png', sizes: '512x512' },
  // ],
  openGraph: {
    title: 'KEYNUT - 키넛',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="KEYNUT" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="background-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/keynut.png" />
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
