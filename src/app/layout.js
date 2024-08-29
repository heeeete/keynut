import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/lib/next-auth';
import RQProvider from './(main)/_components/RQProvider';
import { userAgent } from 'next/server';
import { headers } from 'next/headers';
import { UserProvider } from './(main)/_components/UserProvider';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  viewportFit: 'cover',
};

export async function generateMetadata({}) {
  const { isBot } = userAgent({ headers: headers() });
  const title = isBot ? 'KEYNUT - 커스텀 키보드등 다양한 전자기기 중고거래는 키넛' : 'KEYNUT | 키넛';

  return {
    title,
    description: '커스텀 키보드 | 마우스 | 마우스패드 | 헤드셋 | 모니터는 키넛에서 - 전자기기 중고거래 KEYNUT',
    keywords: [
      '전자기기',
      '중고거래',
      '커스텀 키보드',
      '키보드',
      '마우스',
      '마우스패드',
      '헤드셋',
      '모니터',
      'KEYNUT',
      '키넛',
    ],
    colorScheme: 'light',
    manifest: './manifest.json',
    openGraph: {
      title: 'KEYNUT - 키넛',
      description: '커스텀 키보드 | 마우스 | 마우스패드 | 헤드셋 | 모니터는 키넛에서 - 전자기기 중고거래 KEYNUT',
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
}

// export const metadata = {
//   title: 'KEYNUT - 전자기기 중고거래',
//   description: '커스텀 키보드 | 마우스 | 마우스패드 | 헤드셋 | 모니터는 키넛에서 - 전자기기 중고거래 KEYNUT',
//   keywords: [
//     '전자기기',
//     '중고거래',
//     '커스텀 키보드',
//     '키보드',
//     '마우스',
//     '마우스패드',
//     '헤드셋',
//     '모니터',
//     'KEYNUT',
//     '키넛',
//   ],
//   colorScheme: 'light',
//   manifest: './manifest.json',
//   openGraph: {
//     title: 'KEYNUT - 키넛',
//     description: '커스텀 키보드 | 마우스 | 마우스패드 | 헤드셋 | 모니터는 키넛에서 - 전자기기 중고거래 KEYNUT',
//     images: [
//       {
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`, // 이미지의 절대 URL
//         width: 500,
//         height: 500,
//         alt: 'KEYNUT Logo',
//       },
//     ],
//   },
// };

export default function RootLayout({ children }) {
  const user = userAgent({ headers: headers() });

  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      {/* <body className={inter.className + 'custom-body flex flex-col justify-center items-center'}> */}
      <body className={`${inter.className} custom-body`}>
        <RQProvider>
          <UserProvider initialUser={user}>
            <AuthProvider>
              <main>{children}</main>
            </AuthProvider>
          </UserProvider>
        </RQProvider>
      </body>
    </html>
  );
}
