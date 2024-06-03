'use client';
import Image from 'next/image';
import { useState } from 'react';
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
  { profile: '/철수.webp', path: '/키보드3.jpeg', name: 'purple keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/맹구.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/철수.webp', path: '/키보드3.jpeg', name: 'purple keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/맹구.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/철수.webp', path: '/키보드3.jpeg', name: 'purple keyboard', heart: 5, comment: 10, title: '내 키보두' },
  { profile: '/맹구.webp', path: '/키보드1.webp', name: 'orange keyboard', heart: 5, comment: 10, title: '내 키보두' },
];
export default function Gallery() {
  const [sortOption, setSortOption] = useState(true);
  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="sticky top-20 z-20  bg-white max-md:top-10">
        <div className="flex w-full justify-center items-center min-h-40 max-md:min-h-20">
          <input
            type="text"
            placeholder="상품검색"
            className="border-b rounded-none border-gray-400 border-solid w-96 min-w-48 outline-none max-md:w-64"
          ></input>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="none" stroke="rgb(156,163,175)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21l-4.3-4.3" />
              </g>
            </svg>
          </button>
        </div>
        <div className="flex space-x-2 max-w-screen-xl mx-auto px-2 justify-end py-2">
          <button
            onClick={() => {
              !sortOption && setSortOption(true);
            }}
            className={`${sortOption ? 'text-black' : 'text-gray-500'}`}
          >
            인기순
          </button>
          <button
            onClick={() => {
              sortOption && setSortOption(false);
            }}
            className={`${sortOption ? 'text-gray-500' : 'text-black'}`}
          >
            최신순
          </button>
        </div>
        <hr className="max-w-screen-xl mx-auto" />
      </div>
      <div className="grid grid-cols-4 gap-5 py-3 max-w-screen-xl mx-auto px-2 max-md:grid-cols-3 max-[480px]:grid-cols-2">
        {picks.map((pick, idx) => (
          <div className="flex flex-col w-full" key={idx}>
            <div className="w-full aspect-4/5 relative min-h-32 min-w-32">
              <div className="absolute rounded-full z-10 bg-white w-12 h-12 top-1 left-1 flex items-start justify-center border border-solid max-md:w-10 max-md:h-10">
                <Image
                  className="rounded-full"
                  src={pick.profile}
                  alt={pick.name}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Image className="rounded-md" src={pick.path} alt={pick.name} fill />
            </div>
            <div className="flex items-center space-x-2 w-full py-2">
              <div className="flex-1 line-clamp-1">{pick.title}</div>
              <div className="flex-none flex items-center space-x-1">
                <Image src="/heart.svg" alt="Heart" width={20} height={20} />
                <div className="font-light">{pick.heart}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
