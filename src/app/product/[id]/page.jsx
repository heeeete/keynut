'use client';

import Link from 'next/link';
import React from 'react';
import ImageSlider from '@/app/_components/ImageSlider';

const item = {
  img: ['/img-1.jpeg', '/img-2.jpeg', '/키보드1.webp', '/키보드3.jpeg', '/키보드4.png', '/키보드4.png', '/키보드4.png'],
  title: '스플릿 키보드 팝니다.',
  description: '구매하고 1달 사용',
  price: 120000,
  interest: 3,
  date: '2024-06-01',
  condition: 2,
  category: ['keyboard', 'assembled'],
  user: {
    nickname: '우유먹은송아지',
    profile: '/맹구.webp',
  },
};

// const RenderCondition = React.memo(() => {
//   let condition = '';

//   if (item.condition === 1) condition = '미사용';
//   else if (item.condition === 2) condition = '사용감 없음';
//   else if (item.condition === 3) condition = '사용감 적음';
//   else if (item.condition === 4) condition = '사용감 많음';
//   else if (item.condition === 5) condition = '고장 / 파손';

//   return (
//     <div className="space-x-10">
//       <span>상품상태</span>
//       <span>{condition}</span>
//     </div>
//   );
// });

// RenderCondition.displayName = RenderCondition;

const RenderCondition = () => {
  let condition = '';

  if (item.condition === 1) condition = '미사용';
  else if (item.condition === 2) condition = '사용감 없음';
  else if (item.condition === 3) condition = '사용감 적음';
  else if (item.condition === 4) condition = '사용감 많음';
  else if (item.condition === 5) condition = '고장 / 파손';

  return (
    <div className="space-x-10">
      <span>상품상태</span>
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
  category;
});

RenderInfo.displayName = 'RenderInfo';

export default function Product() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <RenderInfo />
      <ImageSlider images={item.img} />
      <div className="px-10 max-md:px-2">
        <p>{item.title}</p>
        <p>{item.price}</p>
        <RenderCondition />
      </div>
    </div>
  );
}
