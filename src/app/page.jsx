import RenderHome from './_components/renderHome';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import getRecentProducts from './_lib/getRecentProducts';
import ScrollRestoration from './shop/_lib/scrollResotration';

export default async function Home() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({ queryKey: ['recentProducts'], queryFn: getRecentProducts });
    console.log('recent Products prefetchQuery 실행');
  } catch (error) {
    console.error('recent Products prefetchQuery 실행 중 에러 발생:', error);
  }
  const dehydratedstate = dehydrate(queryClient);
  return (
    //HydrationBoundary 컴포넌트로 감싸주면 클라이언트 측에서 별도의 hydrate 호출 없이 서버 측에서 직렬화된 데이터를 자동으로 복원하여 사용
    <HydrationBoundary state={dehydratedstate}>
      <Suspense>
        {/* <ScrollRestoration /> */}
        <RenderHome />
      </Suspense>
    </HydrationBoundary>
  );
}
