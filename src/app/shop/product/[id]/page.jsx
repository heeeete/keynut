import RenderProduct from './_components/RenderProduct';
import React from 'react';
import getProductWithUser from './_lib/getProductWithUser';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import imageToBase64 from '@/utils/imageToBase64';

export default async function Product({ context, params }) {
  const { id } = params;
  const queryClient = new QueryClient();
  // let base64Image;

  try {
    await queryClient.prefetchQuery({ queryKey: ['product', id], queryFn: () => getProductWithUser(id) });
    // const product = queryClient.getQueryData(['product', id]);
    // base64Image = await imageToBase64(product.images[0]);
    console.log('prefetchQuery 실행됨');
  } catch (error) {
    console.error('prefetchQuery 실행 중 에러 발생:', error);
  }

  const dehydratedstate = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedstate}>
      <RenderProduct id={id} />
    </HydrationBoundary>
  );
}
