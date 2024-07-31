'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';

import { Gowun_Dodum } from 'next/font/google';

const title = Gowun_Dodum({ subsets: ['latin'], weight: ['400'] });

const JustIn = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
    staleTime: Infinity,
  });

  return (
    <section className="flex flex-col space-y-5">
      <div className="flex items-end">
        <div className="flex flex-1 flex-col bg-re">
          <div className="font-medium text-xl">just in</div>
          <div className="text-gray-500 font-medium">신규 등록 상품</div>
        </div>
        <Link href={'/shop'} className="rounded">
          <div className="flex items-center font-medium text-sm text-gray-500 px-0.5">더보기</div>
        </Link>
      </div>
      <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
        {data?.map((product, idx) => (
          <Link
            href={`/shop/product/${product._id}`}
            className="flex flex-col cursor-pointer relative max-md:max-w-40 max-md:w-40 max-md:text-sm"
            key={idx}
          >
            <div className="w-full aspect-square relative min-h-32 min-w-32 bg-gray-100">
              <Image
                src={product.images[0]}
                alt={product._id}
                sizes="(max-width: 690px) 250px, (max-width: 1280px) 40vw, 500px"
                fill
                className="rounded object-cover"
              />
              {product.state === 2 ? (
                <div className="absolute left-0 top-0 z-10 rounded-tl rounded-br px-2 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center">
                  <p className="font-semibold text-white text-sm max-md:text-xs">예약중</p>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="mt-2 w-full">
              <div className="break-all line-clamp-1">{product.title}</div>
              <div className="space-x-1 font-semibold break-before-all line-clamp-1">
                <span>{product.price.toLocaleString()}</span>
                <span className="text-sm">원</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const Categories = () => {
  return (
    <section className="flex flex-col space-y-5">
      <div className="flex flex-col">
        <div className="font-medium text-xl">cateory</div>
        <div className="text-gray-500 font-medium">카테고리</div>
      </div>
      <ul className="flex space-x-3 overflow-auto scrollbar-hide">
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=1'}>
            <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-gray-100 justify-center items-center max-md:w-24">
              <Image className="max-md:w-16" src="/keyboard.svg" width={80} height={80} alt="keyboard" />
            </div>
          </Link>
          <p className="text-gray-600">키보드</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=2'}>
            <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-slate-100 justify-center items-center max-md:w-24">
              <Image className="max-md:w-9" src="/mouse.svg" width={45} height={45} alt="mouse" />
            </div>
          </Link>
          <p className="text-gray-600">마우스</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=3'}>
            <div className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-black bg-opacity-5 justify-center items-center max-md:w-24">
              <svg width="60" height="50" viewBox="0 0 496 265" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="494.042" height="264" rx="19.5" fill="#EBEBEB" stroke="black" />
                <rect x="17.5" y="14.5" width="461" height="236" rx="19.5" fill="#A3A3A3" stroke="black" />
              </svg>
            </div>
          </Link>
          <p className="text-gray-600">패드</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=9'}>
            <div className="flex w-28 aspect-square min-h-16 min-w-16 bg-black bg-opacity-10 rounded justify-center items-center max-md:w-24">
              <svg
                className="max-md:w-10"
                xmlns="http://www.w3.org/2000/svg"
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M7.673 21.02L11.712 14L4 13.096L15.25 2.981h1.116l-4.135 7.038l7.769.885L8.75 21.019z"
                />
              </svg>
            </div>
          </Link>
          <p className="text-gray-600">기타</p>
        </li>
      </ul>
    </section>
  );
};

export default function RenderHome() {
  return (
    <div className="flex flex-col w-full max-md:main-768 -translate-y-6">
      <Link
        href={'/shop'}
        className={`${title.className} flex flex-col text-center bg-black overflow-hidden h-48 text-2xl items-center relative justify-center max-md:h-36 text-gray-500 max-md:text-lg max-md:px-4  max-md:translate-y-0`}
      >
        <div className="flex items-center justify-center font-semibold text-gray-100 z-2">
          키넛에서 다양한 전자제품을 쉽고 빠르게 거래해보세요!
        </div>
      </Link>
      <div className="w-full max-w-screen-xl mx-auto px-10  space-y-12 my-10 max-md:px-3 ">
        <Categories />
        <JustIn />
      </div>
      {/* <section className="flex flex-col space-y-5">
        <div className="flex items-end">
        <div className="flex flex-1 flex-col">
        <div className="font-medium text-xl">top picks</div>
        <div className="text-gray-600 font-medium">인기 사진</div>
        </div>
        <Link href={'/gallery'}>
            <div className="font-medium text-sm">더보기 +</div>
          </Link>
        </div>
        <TopPicks picks={picks} />
      </section> */}
    </div>
  );
}
