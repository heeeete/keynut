import RenderHome from './_components/RenderHome';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import getRecentProducts from './_lib/getRecentProducts';

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
    staleTime: 60 * 1000,
  });

  const dehydratedstate = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedstate}>
      <RenderHome />
    </HydrationBoundary>
  );
}
