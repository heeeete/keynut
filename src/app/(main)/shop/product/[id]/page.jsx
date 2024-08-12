import RenderProduct from './_components/RenderProduct';
import React from 'react';
import getProductWithUser from './_lib/getProductWithUser';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Warning from '@/app/(main)/_components/Warning';

export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await getProductWithUser(id);

  const title = product ? `${product.title}ㅣKEYNUT` : 'KEYNUT';
  const description = product ? product.description : '상품을 찾을 수 없습니다.';
  const imageUrl = product ? product.images[0] : `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 500,
          height: 500,
          alt: 'KEYNUT Logo',
        },
      ],
    },
  };
}

export default async function Product({ context, params }) {
  const { id } = params;
  if (id.length !== 24) return <Warning message={'존재하지 않는 상품입니다.'} />;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => getProductWithUser(id),
    });
    if (!queryClient.getQueryData(['product', id])) {
      return <Warning message={'존재하지 않는 상품입니다.'} />;
    }
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
