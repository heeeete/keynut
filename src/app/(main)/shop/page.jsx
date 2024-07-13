import RenderShop from './RenderShop';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import getProducts from './_lib/getProducts';
import { Suspense } from 'react';
import fetchHotProducts from './_lib/fetchHotProducts';

export default async function Shop({ props }) {
  const queryClient = new QueryClient();
  //queryclient를 사용하여 getProducts 사전실행 -> 서버측에서 미리 데이터를 가져옴, ['products'] 라는 키로 캐시됨
  try {
    // 서버에서 데이터를 미리 가져옴
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['products', ''],
      queryFn: getProducts,
      initialPageParam: 0,
      staleTime: 60 * 1000,
    });
    await queryClient.prefetchQuery({
      queryKey: ['topProducts', 0],
      queryFn: () => fetchHotProducts(0),
      staleTime: 60 * 1000,
    });
  } catch (error) {
    console.error('prefetchQuery 실행 중 에러 발생:', error);
  }
  const dehydratedstate = dehydrate(queryClient);
  //쿼리클라이언트의 상태를 직렬화 -> JSON형태로 변환, HTML의 일부로 포함되어 클라이언트로 전달됨

  return (
    //HydrationBoundary 컴포넌트로 감싸주면 클라이언트 측에서 별도의 hydrate 호출 없이 서버 측에서 직렬화된 데이터를 자동으로 복원하여 사용
    <HydrationBoundary state={dehydratedstate}>
      <Suspense>
        <RenderShop />
      </Suspense>
    </HydrationBoundary>
  );
}

// 나중에 정적 페이지 생성 해야함 처음에 먼저 보여줄 데이터를 가져와 정적 페이지를 생성해서 빠르게 보여주고
// 나머지 인피니티 스크롤해서 나오는 상품들은 클라이언트 사이드에서 바로바로 가져옴
// export async function generateStaticParams() {
//   const posts = await getProductWithUser();

//   return posts.map(post => ({
//     slug: post.slug,
//   }));
// }
