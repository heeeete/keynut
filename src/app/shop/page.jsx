import RenderShop from './renderShop';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import getProducts from './_lib/getProducts';

export default async function Shop({ props }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['products'], queryFn: getProducts });
  const dehydratedstate = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedstate}>
      <RenderShop />
    </HydrationBoundary>
  );
}
