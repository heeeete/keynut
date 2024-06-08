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
    title: '내키보드헤헤헤헤이뿌지?',
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
  const [searchText, setSearchText] = useState('');
  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-20 z-20 bg-white  border-b w-full max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:top-14">
        <div className="flex w-full justify-center items-center min-h-24 max-md:min-h-12 max-md:h-12 max-md:pt-2">
          <div className="flex rounded-none border-b-2 w-450 px-1 py-1 max-md:border-none max-md:rounded max-md:px-3 max-md:bg-gray-100 max-md:w-full max-md:h-full">
            <input
              type="text"
              placeholder="상품검색"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="outline-none w-450 pr-2 max-md:w-full max-md:bg-transparent"
            />
            {searchText.length ? (
              <button onClick={() => setSearchText('')}>
                <svg
                  className=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.7em"
                  height="0.7em"
                  viewBox="0 0 2048 2048"
                >
                  <path
                    fill="currentColor"
                    d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                  />
                </svg>
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="flex space-x-2 justify-end py-2">
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
        {/* <hr className="" /> */}
      </div>
      <div className="grid grid-cols-4 gap-2 py-2 w-full max-w-screen-xl mx-auto px-10 max-md:px-2  max-md:grid-cols-2">
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
              <Image className="rounded-sm" src={pick.path} alt={pick.name} fill />
            </div>
            <div className="flex items-center space-x-2 w-full py-1">
              <div className="flex-1 break-all overflow-hidden line-clamp-1">{pick.title}</div>
              <div className="flex-none flex items-center">
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
