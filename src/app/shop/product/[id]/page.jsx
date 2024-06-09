'use client';

import Link from 'next/link';
import React from 'react';
import ImageSlider from '@/app/_components/ImageSlider';
import Image from 'next/image';
import timeAgo from '@/app/utils/timeAgo';

const item = {
  img: ['/img-1.jpeg', '/img-2.jpeg', '/키보드1.webp', '/키보드3.jpeg', '/키보드4.png'],
  title: '스플릿 키보드 팝니다',
  description: `제가 애지중지 사용하던 키보드를 판매합니다. 모델은 [키보드 모델명]이고, 스위치는 [스위치 종류]입니다. 타건감 정말 좋고, LED 백라이트 덕분에 밤에도 사용하기 편리합니다.

약 [사용 기간] 동안 사용했지만, 깔끔하게 관리해서 큰 흠집이나 문제는 없습니다. 모든 키 정상 작동합니다. 여분의 키캡과 키캡 풀러도 같이 드릴게요.

개인적인 사정으로 판매하는 것이니 관심 있으신 분들은 편하게 연락 주세요. 빠른 거래 원합니다!

감사합니다.`,
  price: 120000,
  interest: 3,
  date: 1717564205998,
  condition: 2,
  bookmarked: 10,
  category: ['keyboard', 'assembled'],
  user: {
    nickname: '우유먹은송아지',
    profile: '/키보드1.webp',
  },
};

const RenderCondition = () => {
  let condition = '';

  if (item.condition === 1) condition = '미사용';
  else if (item.condition === 2) condition = '사용감 없음';
  else if (item.condition === 3) condition = '사용감 적음';
  else if (item.condition === 4) condition = '사용감 많음';
  else if (item.condition === 5) condition = '고장 / 파손';

  return (
    <div className="flex space-x-10 justify-center items-center">
      <div className="flex  items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <span>상품상태</span>
      </div>
      <span>{condition}</span>
    </div>
  );
};

const RenderInfo = React.memo(() => {
  const category = {
    keyboard: '키보드',
    assembled: '완제품',
    housing: '하우징',
    switch: '스위치',
    plate: '보강판',
    artisan: '아티산',
    keycap: '키캡',
    pcb: 'PCB',
    'keyboard-others': '기타',
    mouse: '마우스',
    'mouse-others': '기타',
  };

  return (
    <span className="flex items-center text-gray-400 text-sm px-10 max-md:px-2">
      <Link href={'/shop?q=qweqwe'}>{category[item.category[0]]}</Link>
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
        <g fill="none" fillRule="evenodd">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
          <path
            fill="#ababab"
            d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
          />
        </g>
      </svg>
      <Link href={'/shop?q='}>{category[item.category[1]]}</Link>
    </span>
  );
});

RenderInfo.displayName = 'RenderInfo';

const RenderTimeAgo = ({ date }) => {
  return <p>{timeAgo(date)}</p>;
};

const RenderBookMark = () => {
  return (
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 32 32">
        <path fill="grey" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
      <p>{item.bookmarked}</p>
    </div>
  );
};

export default function Product() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <RenderInfo />
      <ImageSlider images={item.img} />
      <div className="px-10 space-y-6 max-md:px-2">
        <p className="text-xl font-bold">{item.title}</p>
        <p className="space-x-2">
          <span className="text-2xl font-bold">{item.price.toLocaleString()}</span>
          <span className="text-xl">원</span>
        </p>
        <div className="flex w-full justify-between text-sm text-slate-500 font-semibold">
          <RenderCondition />
          <div className="flex space-x-2 font-normal">
            <RenderTimeAgo date={item.date} />
            <RenderBookMark />
          </div>
        </div>
        <div className="border px-3 py-1 rounded min-h-24">
          <p className="whitespace-pre-wrap">{item.description}</p>
        </div>
        <div className="flex h-16 justify-between space-x-2 ">
          <div className="flex flex-0.8 h-full border rounded items-center px-4 max-md:px-2">
            <div className="rounded-full w-14 aspect-square relative max-md:w-16">
              <Image className="rounded-full" src={item.user.profile} alt="" fill />
            </div>
            <div className="flex w-full items-center justify-between pl-4 max-md:flex-col max-md:items-start max-md:space-y-1">
              <div className="text-lg max-md:text-base line-clamp-1">{item.user.nickname}</div>
              <button>
                <div className=" text-base px-3 py-1 border border-gray-300 rounded max-md:text-sm line-clamp-1">
                  상점 가기
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-0.2 justify-end space-x-2">
            <div className="flex justify-center items-center w-16 rounded bg-orange-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 16 16">
                <path
                  fill="white"
                  d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234c-.2.032-.352-.176-.273-.362c.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0a1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
                />
              </svg>
            </div>
            <div className="flex justify-center items-center w-16 rounded bg-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 32 32">
                <path fill="white" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
