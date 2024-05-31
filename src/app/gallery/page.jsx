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
    <main className="flex flex-col space-y-2">
      <div className="flex space-x-2 justify-end">
        <div
          onClick={() => {
            !sortOption && setSortOption(true);
          }}
          className={`${sortOption ? 'text-black' : 'text-gray-500'}`}
        >
          인기순
        </div>
        <div
          onClick={() => {
            sortOption && setSortOption(false);
          }}
          className={`${sortOption ? 'text-gray-500' : 'text-black'}`}
        >
          최신순
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
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
            <div className="flex items-center space-x-2 w-full py-2 max-md:max-w-32">
              <div className="flex-1 line-clamp-1">{pick.title}</div>
              <div className="flex-none flex items-center space-x-1">
                <Image src="/heart.svg" alt="Heart" width={16} height={16} />
                <div className="text-sm">{pick.heart}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
