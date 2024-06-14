'use client';

import Image from 'next/image';
import Link from 'next/link';
import HomeProduct from './_components/HomeProduct';
import React, { useEffect } from 'react';

const images = [
  {
    path: '/키보드1.webp',
    name: 'pdpdpdpdpdpdppdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpd',
    price: '12,5000원',
    bookMarked: false,
  },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
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
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('/api/GET/user', {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Data:', data);
      } else {
        console.error('Failed to fetch user');
      }
    };
    getUser();
  }, []);

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
        <HomeProduct images={images} />
      </section>
      <section className="flex flex-col space-y-5">
        <div className="flex items-end">
          <div className="flex flex-1 flex-col">
            <div className="font-medium text-xl">hot</div>
            <div className="text-gray-600 font-medium">인기 상품</div>
          </div>
          <div className="font-medium text-sm">더보기 +</div>
        </div>
        <HomeProduct images={images} />
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
