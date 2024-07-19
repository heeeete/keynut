import RenderProduct from './_components/RenderProduct';
import React from 'react';
import getProductWithUser from './_lib/getProductWithUser';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await getProductWithUser(id);

  return {
    title: product ? `${product.title}ㅣKEYNUT` : 'KEYNUT',
    description: product ? `${product.description}` : '다양한 전자기기를 한눈에',
    openGraph: {
      title: product ? `${product.title}ㅣKEYNUT` : 'KEYNUT',
      description: product ? `${product.description}` : '다양한 전자기기를 한눈에',
      images: [
        {
          url: product.images ? product.images[0] : '/keynutLogo',
          width: 400,
          height: 400,
        },
      ],
    },
  };
}

export default async function Product({ context, params }) {
  const { id } = params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => getProductWithUser(id),
    });
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
