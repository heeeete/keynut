'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';
import { Gowun_Dodum } from 'next/font/google';
import conditions from '../_constants/conditions';
import { ProductData } from '@/type/productData';
import ModelViewer from './ModelViewer';

const title = Gowun_Dodum({ subsets: ['latin'], weight: '400' });

const JustIn = () => {
  const { data, error, isLoading } = useQuery<ProductData[]>({
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
        <Link href={'/shop'} aria-label="more" className="rounded">
          <div className="flex items-center font-medium text-sm text-gray-500 px-0.5">더보기</div>
        </Link>
      </div>
      <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
        {data?.map((product, idx) => (
          <Link
            href={`/shop/product/${product._id}`}
            className="flex flex-col cursor-pointer relative max-md:max-w-40 max-md:w-40 max-md:text-sm"
            key={product._id}
          >
            <div className="w-full aspect-square relative min-h-32 min-w-32 bg-gray-100">
              <Image
                src={
                  product.images.length
                    ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.images[0].name}`
                    : '/noImage.svg'
                }
                alt={product._id}
                sizes="(max-width: 690px) 250px, (max-width: 1280px) 40vw, 500px"
                fill
                className="rounded object-cover"
              />
              {product.state === 2 ? (
                <div className="absolute left-1 top-1 z-10 rounded px-2 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center">
                  <p className="font-semibold text-white text-sm max-[960px]:text-xs max-md:text-xxs">예약중</p>
                </div>
              ) : (
                ''
              )}
              <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-[960px]:text-xxs">
                {conditions[product.condition].option}
              </div>
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
          <Link
            href={'/shop?categories=1'}
            aria-label="keyboard category"
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-gray-100 justify-center items-center max-md:w-24"
          >
            <Image className="max-md:w-16" src="/keyboard.svg" width={80} height={80} alt="keyboard" />
          </Link>
          <p className="text-gray-600">키보드</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=2'}
            aria-label="mouse category"
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-slate-100 justify-center items-center max-md:w-24"
          >
            <Image className="max-md:w-9" src="/mouse.svg" width={45} height={45} alt="mouse" />
          </Link>
          <p className="text-gray-600">마우스</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=3'}
            aria-label="pad category"
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-gray-100 justify-center items-center max-md:w-24"
          >
            <svg width="60" height="50" viewBox="0 0 496 265" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="494.042" height="264" rx="19.5" fill="#FFFF" stroke="black" />
              <rect x="17.5" y="14.5" width="461" height="236" rx="19.5" fill="#666666" stroke="black" />
            </svg>
          </Link>
          <p className="text-gray-600">패드</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=4'}
            aria-label="monitor category"
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-slate-100 justify-center items-center max-md:w-24"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 64 64">
              <path fill="#d1d1d1" d="M62 6c0-2-2-4-4-4H6C4 2 2 4 2 6v38h60z" />
              <path fill="#e8e8e8" d="M2 44v4c0 2 2 4 4 4h52c2 0 4-2 4-4v-4z" />
              <path fill="#bfbebe" d="M24 54c0 4-4 4-8 4h32c-4 0-8 0-8-4v-2H24z" />
              <path fill="#404040" d="M6 6h52v34H6z" />
              <g fill="#94989b">
                <circle cx="32" cy="47.9" r="1" />
                <path d="M16 58h32v4H16z" />
              </g>
            </svg>
          </Link>
          <p className="text-gray-600">모니터</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=5'}
            aria-label="headphone category"
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded  bg-gray-100 justify-center items-center max-md:w-24"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 64 64">
              <path
                fill="#454749"
                d="M47.5 45.1c-6.6 12.1-6.5 13.1-9.6 11.3c-3.1-1.8-4.3-3.4 2.4-15.4S48.9 29.1 52 30.9c3 1.7 2.1 2.2-4.5 14.2"
              />
              <path
                fill="#adadad"
                d="M53.7 48.7c-4.2 7.7-9.4 11.4-11.9 10c-3.1-1.8-1.5-1.8 5.1-13.9s5.8-13.5 8.9-11.7c2.5 1.4 2.1 7.9-2.1 15.6"
              />
              <path
                fill="#454749"
                d="M16.5 45.1c6.6 12.1 6.5 13.1 9.6 11.3c3.1-1.8 4.3-3.4-2.4-15.4S15.1 29.1 12 30.9c-3 1.7-2.1 2.2 4.5 14.2"
              />
              <path
                fill="#adadad"
                d="M10.3 48.7c4.2 7.7 9.4 11.4 11.9 10c3.1-1.8 1.5-1.8-5.1-13.9s-5.8-13.5-8.9-11.7c-2.5 1.4-2.1 7.9 2.1 15.6"
              />
              <path
                fill="#adadad"
                d="M11.3 57.7s5.4 1.4 5.8 0c2.5-8.1-11.4-12.9-11.4-22.1C5.7 20.8 17.5 8.8 32 8.8s26.3 12 26.3 26.8c0 9.2-13.9 14-11.4 22.1c.4 1.4 5.8 0 5.8 0c5.7-5.6 9.3-13.4 9.3-22.1C62 18.7 48.6 5 32 5S2 18.7 2 35.6c0 8.7 3.6 16.5 9.3 22.1"
              />
              <path
                fill="#454749"
                d="M14.9 17.6c3.5-.7 8-5.7 17.1-5.7c9.1 0 13.7 5.1 17.1 5.7c1.4.3 3.8-1.9 3.8-1.9c-5.5-6.3-12-9.5-20.9-9.5c-8.9 0-15.4 3.2-20.9 9.5c0 .1 2.4 2.2 3.8 1.9"
              />
            </svg>
          </Link>
          <p className="text-gray-600">헤드셋</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=9'} aria-label="others category">
            <div className="flex w-28 aspect-square min-h-16 min-w-16 bg-slate-100 rounded justify-center items-center max-md:w-24">
              <svg
                className="max-md:w-10"
                xmlns="http://www.w3.org/2000/svg"
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="darkgray"
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
    <div className="flex flex-col w-full min-h-80vh md:-mt-4 max-[960px]:pt-12">
      {/* <Link
        href={'/shop'}
        className={`${title.className} relative flex text-center bg-header max-h-50vh h-100vh items-center  justify-center max-md:h-20vh max-md:text-lg max-md:px-4 bg-center bg-cover  max-md:translate-y-0 max-md:bg-cover`}
      > */}
      {/* <div className="header-gradient" />
        <div className="flex items-center justify-center font-bold z-50 text-3xl text-gray-200  text-opacity-60 z-2 max-[1024px]:text-2xl max-md:text-lg max-md:text-opacity-20">
          키넛에서 다양한 전자기기를 만나보세요
        </div> */}
      {/* </Link> */}
      <div className="max-h-50vh h-100vh max-md:h-20vh">
        <ModelViewer />
      </div>
      <div className="w-full max-w-screen-xl mx-auto px-10  space-y-12 my-10 max-md:px-3 ">
        <Categories />
        <JustIn />
      </div>
    </div>
  );
}
