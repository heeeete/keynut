'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  // const queryClient = useQueryClient();
  // const heart = useMutation({
  //   mutationFn: () => {},
  //   onMutate() {},
  //   onError() {},
  //   onSettled() {},
  // });
  return (
    <div className="flex flex-col h-96 items-center justify-center space-y-2 max-md:custom-dvh">
      <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M7.5 6A1.5 1.5 0 0 0 6 7.5H4A1.5 1.5 0 0 0 2.5 9v11A1.5 1.5 0 0 0 4 21.5h2V30h2v-8.5h16V30h2v-8.5h2a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 28 7.5h-2a1.5 1.5 0 0 0-3 0H9A1.5 1.5 0 0 0 7.5 6m-4 5.975L6.975 8.5h5.05L3.5 17.025zM4.975 20.5l12-12h5.05l-12 12zm22-12H28a.5.5 0 0 1 .5.5v3.025L20.025 20.5h-5.05zm1.525 8.475V20a.5.5 0 0 1-.5.5h-3.025z"
        />
      </svg>
      <p className="font-semibold text-xl">페이지 공사중..</p>
    </div>
  );
  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-0 flex flex-col z-20 border-b bg-white">
        <div className="search-bar-container-md max-md:search-bar-container-maxmd">
          <div className="search-bar-md max-md:search-bar-maxmd">
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
        <div className="flex justify-end items-end w-full px-10 pb-1 pt-6 max-w-screen-xl mx-auto max-md:p-2 max-md:pt-0">
          <div className="flex space-x-2 items-center">
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
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 py-2 w-full max-w-screen-xl mx-auto px-10 max-md:px-2  max-md:grid-cols-2 max-md:gap-3">
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
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Image
                className="rounded object-cover"
                src={pick.path}
                alt={pick.name}
                fill
                sizes="(max-width:768px) 50vw, (max-width:1280px) 25vw , 290px"
              />
            </div>
            <div className="flex items-center space-x-2 w-full py-1">
              <div className="flex-1 break-all overflow-hidden line-clamp-1">{pick.title}</div>
              <div className="flex-none flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 1024 1024">
                  <path
                    stroke="black"
                    strokeWidth="50"
                    className="hover:stroke-pink-500"
                    fill="white"
                    fillOpacity="0.5"
                    d="M679.7 201c-73.1 0-136.5 40.8-167.7 100.4C480.8 241.8 417.4 201 344.3 201c-104 0-188.3 82.6-188.3 184.5c0 201.2 356 429.3 356 429.3s356-228.1 356-429.3C868 283.6 783.7 201 679.7 201"
                  />
                </svg>
                {/* <Image src="/heart.svg" alt="Heart" width={20} height={20} /> */}
                {/* <div className="font-light">{pick.heart}</div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
