import RenderHome from './_components/RenderHome';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import getRecentProducts from './_lib/getRecentProducts';

export const metadata = {
  applicationName: 'KEYNUT',
  title: 'KEYNUT - 전자기기 중고거래',
  description: '커스텀 키보드 | 마우스 | 마우스패드 | 헤드셋 | 모니터는 키넛에서 - 전자기기 중고거래',
  keywords: ['전자기기', '중고거래', '커스텀 키보드', '키보드', '마우스', '마우스패드', '헤드셋', '모니터', 'KEYNUT'],
  colorScheme: 'light',
  robots: 'nosnippet',
};

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['recentProducts'], queryFn: getRecentProducts, staleTime: 60 * 1000 });

  const dehydratedstate = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedstate}>
      <RenderHome />
    </HydrationBoundary>
  );
}
