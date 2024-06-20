'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn } from 'next-auth/react';

const images = [
  {
    path: '/키보드1.webp',
    name: 'pdpdpdpdpdpdppdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpd',
    price: '12,5000',
    bookMarked: false,
  },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000', bookMarked: false },
];
const picks = [
  { profile: '/키보드1.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: 'haha' },
  { profile: '/키보드3.jpeg', path: '/키보드4.png', name: 'yellow keyboard', heart: 5, comment: 10, title: 'hehe' },
  {
    profile: '/유리.webp',
    path: '/키보드3.jpeg',
    name: 'purple keyboard',
    heart: 5,
    comment: 10,
    title: '내 키보드 헤헤헤헤 이뿌지?',
  },
  { profile: '/철수.webp', path: '/키보드3.jpeg', name: 'purple keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/맹구.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: '내 키보두' },
];
export default function Home() {
  const TopPicks = ({ picks }) => {
    return (
      <div className="grid grid-cols-5 gap-2 max-md:flex overflow-auto scrollbar-hide">
        {picks.map((pick, idx) => (
          <div className="flex flex-col w-full" key={idx}>
            <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
              <div className="absolute rounded-full z-10 bg-white w-12 h-12 top-1 left-1 flex items-start justify-center border border-solid max-md:w-10 max-md:h-10">
                <Image
                  className="rounded-full object-cover"
                  src={pick.profile}
                  alt={pick.name}
                  fill
                  sizes="(max-width:768px) 40px, 48px"
                />
              </div>
              <Image
                className="rounded object-cover"
                src={pick.path}
                alt={pick.name}
                fill
                sizes="(max-width:690px) 128px,(max-width:1280px) 20vw, 234px"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex max-w-screen-xl mx-auto px-10 flex-col space-y-12 max-md:px-2 max-md:main-768">
      <button onClick={() => signIn()}>로그인</button>
      <Link href={'/sell'}>물건팔기</Link>
      <section className="flex flex-col space-y-5">
        <div className="flex flex-col">
          <div className="font-medium text-xl">cateory</div>
          <div className="text-gray-600 font-medium">카테고리</div>
        </div>
        <div className="flex space-x-3 overflow-auto scrollbar-hide">
          <li className="flex w-36 aspect-square min-h-16 min-w-16 bg-white  border rounded-full"></li>
          <li className="flex w-36 aspect-square min-h-16 min-w-16 bg-white border rounded-full"></li>
          <li className="flex w-36 aspect-square min-h-16 min-w-16 bg-white border rounded-full"></li>
          <li className="flex w-36 aspect-square min-h-16 min-w-16 bg-white  border rounded-full"></li>
        </div>
      </section>
      <section className="flex flex-col space-y-5">
        <div className="flex items-end">
          <div className="flex flex-1 flex-col">
            <div className="font-medium text-xl">just in</div>
            <div className="text-gray-600 font-medium">신규 등록 상품</div>
          </div>
          <div className="font-medium text-sm">더보기 +</div>
        </div>
        <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
          {images.map((img, idx) => (
            <div className="flex flex-col max-md:max-w-40 max-md:w-40" key={idx}>
              <div className="w-full aspect-square relative min-h-32 min-w-32">
                <div className="absolute top-1 right-1 z-10">
                  <svg
                    className="w-7 h-7  max-md:w-5 max-md:h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 32 32"
                  >
                    <path
                      stroke="black"
                      fill={img.bookMarked ? 'black' : 'white'}
                      d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                    />
                  </svg>
                </div>
                <Image
                  src={img.path}
                  alt={img.name}
                  sizes="(max-width: 690px) 128px, (max-width: 1280px) 20vw, 235px"
                  fill
                  className="rounded"
                />
              </div>
              <div className="mt-2 w-full">
                <div className="text-lg break-all line-clamp-2">{img.name}</div>
                <div className="space-x-1 font-semibold">
                  <span>{img.price}</span>
                  <span className="text-sm">원</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col space-y-5">
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
      </section>
    </div>
  );
}
