'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';

import { Gowun_Dodum } from 'next/font/google';
import conditions from '../_constants/conditions';

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
                src={
                  product.images.length
                    ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.images[0]}`
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
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-gray-100 justify-center items-center max-md:w-24"
          >
            <Image className="max-md:w-16" src="/keyboard.svg" width={80} height={80} alt="keyboard" />
          </Link>
          <p className="text-gray-600">키보드</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=2'}
            className="flex w-28 aspect-square min-h-16 min-w-16 rounded bg-slate-100 justify-center items-center max-md:w-24"
          >
            <Image className="max-md:w-9" src="/mouse.svg" width={45} height={45} alt="mouse" />
          </Link>
          <p className="text-gray-600">마우스</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link
            href={'/shop?categories=3'}
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
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 64 64">
                <path
                  fill="gray"
                  d="M32 5C15.431 5 2 18.469 2 35.086c0 8.547 3.562 16.256 9.267 21.734c0 0 4.067 1.049 5.429.415c1.532 1.132 3.01 1.765 4.3 1.765h.001c.606 0 1.157-.138 1.64-.408c.914-.515 1.689-1.013 1.923-1.91c.042-.162.062-.324.065-.491c.427-.073.898-.3 1.49-.633c3.072-1.729 4.257-3.304-2.375-15.165c-6.632-11.859-8.59-11.666-11.664-9.938c-.589.331-1.015.62-1.3.945a1.93 1.93 0 0 0-1.043-.285c-.624 0-1.224.269-2.051.733c-1.13.635-1.789 1.947-1.953 3.77c-.011-.177-.025-.353-.025-.532a26.317 26.317 0 0 1 7.25-18.173c.657.363 1.362.637 1.905.534c3.468-.656 7.998-5.639 17.141-5.639c9.145 0 13.673 4.982 17.141 5.639c.544.103 1.25-.17 1.906-.534a26.314 26.314 0 0 1 7.251 18.173c0 .182-.015.357-.025.535c-.163-1.823-.823-3.137-1.953-3.772c-.827-.465-1.427-.733-2.052-.733a1.93 1.93 0 0 0-1.043.285c-.285-.325-.711-.614-1.301-.945c-3.074-1.729-5.032-1.922-11.664 9.938c-6.632 11.861-5.447 13.436-2.373 15.165c.591.332 1.063.559 1.488.633c.004.167.024.329.066.491c.233.897 1.008 1.396 1.922 1.91a3.325 3.325 0 0 0 1.641.407c1.291 0 2.77-.633 4.302-1.764c1.362.633 5.428-.416 5.428-.416C58.44 51.342 62 43.633 62 35.086C62 18.469 48.569 5 32 5M8.6 33.488c.264-.147.878-.493 1.134-.493c.39 0 1.345 1.869 2.452 4.033a212.71 212.71 0 0 0 4.039 7.593a210.906 210.906 0 0 0 4.352 7.41c1.274 2.093 2.281 3.745 2.169 4.176c-.034.129-.379.381-1.025.744a1.467 1.467 0 0 1-.723.168h-.001c-.937 0-2.202-.584-3.612-1.713c.392-4.836-5.042-8.532-8.632-13.021c-.572-1.6-.953-3.121-1.113-4.49c-.262-2.238.107-3.926.96-4.407m47.762 4.407c-.16 1.369-.542 2.893-1.113 4.492c-3.591 4.488-9.023 8.186-8.633 13.02c-1.41 1.129-2.676 1.713-3.612 1.713c-.282 0-.524-.057-.724-.168c-.646-.363-.991-.614-1.025-.744c-.111-.43.895-2.08 2.168-4.171a212.126 212.126 0 0 0 4.354-7.415c1.833-3.277 3.106-5.77 4.036-7.588c1.107-2.167 2.063-4.038 2.454-4.038c.257 0 .871.346 1.134.493c.854.48 1.222 2.167.961 4.406"
                />
              </svg> */}
          </Link>
          <p className="text-gray-600">헤드셋</p>
        </li>
        <li className="flex flex-col items-center space-y-1">
          <Link href={'/shop?categories=9'}>
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
      <Link
        href={'/shop'}
        className={`${title.className} relative flex text-center bg-header h-72 items-center  justify-center max-md:h-40 max-md:text-lg max-md:px-4 bg-center bg-contain  max-md:translate-y-0 max-md:bg-cover`}
      >
        <div className="header-gradient" />
        <div className="flex items-center justify-center font-bold z-50 text-3xl text-gray-200  text-opacity-40 z-2 max-[1024px]:text-2xl max-md:text-lg max-md:text-opacity-20">
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
