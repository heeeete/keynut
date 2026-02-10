// import RenderHome from './_components/RenderHome';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
// import getRecentProducts from './_lib/getRecentProducts';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./_components/RenderHome'),
  { ssr: false }, // SSR 비활성화
);

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['recentProducts'],
    // queryFn: getRecentProducts,
    staleTime: 60 * 1000,
  });

  const dehydratedstate = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedstate}>
      <DynamicComponentWithNoSSR />
    </HydrationBoundary>
  );
}
