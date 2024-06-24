import RenderProduct from './_components/RenderProduct';
import React from 'react';
import getProductWithUser from './_lib/getProductWithUser';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const isMob = () => {
  const headers = new Headers();
  const userAgent = headers.get('user-agent') || '';
  if (/Mobi|Android/i.test(userAgent)) return true;
  return false;
};

export default async function Product({ context, params }) {
  const { id } = params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({ queryKey: ['product', id], queryFn: () => getProductWithUser(id) });
    console.log('prefetchQuery 실행됨');
  } catch (error) {
    console.error('prefetchQuery 실행 중 에러 발생:', error);
  }

  const dehydratedstate = dehydrate(queryClient);
  console.log(context);

  return (
    <HydrationBoundary state={dehydratedstate}>
      <RenderProduct id={id} />
    </HydrationBoundary>
  );
}
