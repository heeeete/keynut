'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import getProducts from './_lib/getProducts';

function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const onSubmit = e => {
    if (e.key === 'Enter') {
      if (!keyword) return router.push(`/price`);

      const params = new URLSearchParams();
      params.append('keyword', keyword);
      router.push(`/price?${params.toString()}`);
    }
  };

  return (
    <input
      type="text"
      value={keyword}
      onChange={e => setKeyword(e.target.value)}
      placeholder="상품명"
      onKeyDown={onSubmit}
    />
  );
}

export default function RenderPage() {
  const [price, setPrice] = useState(0);
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const calculate = useRef(true);

  const { data, fetchNextPage, hasNextPage, isFetching, error, isLoading } = useInfiniteQuery({
    queryKey: ['products', keyword],
    queryFn: ({ pageParam }) => getProducts(keyword, pageParam, calculate.current),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.products?.length === 0) return undefined;
      calculate.current = false; // 이후 요청에서는 평균 가격을 계산하지 않도록 설정
      return lastPage.products[lastPage.products.length - 1]._id;
    },
    staleTime: 60 * 1000,
    enabled: Boolean(keyword),
  });

  // useEffect(() => {
  //   if (data) {
  //     setPrice(data.pages[0].price);
  //   }
  // }, [data]);

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchBar />
      <div>평균 가격: {price}</div>
      {/* 데이터 렌더링 부분 추가 */}
    </div>
  );
}
