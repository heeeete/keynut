'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Selling from './_components/Selling';
import SellCompleted from './_components/SellCompleted';
import MyPost from './_components/MyPost';
import LikedPost from './_components/LikedPost';
import { useSession } from 'next-auth/react';

import Link from 'next/link';

const selling = [
  { path: '/키보드1.webp', name: 'orangekeyboards;dlcja;ljdcklasd', price: '12,5000원' },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원' },
];
const sellCompleted = [
  { path: '/키보드3.jpeg', name: 'pdpdpdpdpdpdppdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpdpd', price: '20,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원' },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원' },
];

const myPost = [
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
];

const likedPost = [
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
  { path: '/키보드1.webp', title: 'orange keyboard' },
  { path: '/키보드4.png', title: 'yellow keyboard' },
];

const getProducts = async (id, state) => {
  const res = await fetch(`/api/user/${id}/products?state=${state}`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }
  const data = await res.json();
};

export default function MyPage() {
  const { data: session, status } = useSession();
  const [productOption, setProductOption] = useState('selling');
  const [postOption, setPostOption] = useState('');

  useEffect(() => {
    if (session) {
      getProducts(session.user.id, 1);
    }
  }, [session]);

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      <div className="flex h-24 border border-gray-300 rounded-md items-center px-4 max-md:px-2">
        <div className="flex flex-1 items-center space-x-5">
          {session && session.user.image ? (
            <div className="flex rounded-full w-20 aspect-square relative justify-center items-center border max-md:w-16 ">
              <Image
                className="rounded-full object-cover"
                src={session.user.image}
                alt="myprofile"
                fill
                sizes="(max-width:768px) 80px,100px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 defualt-profile max-md:w-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                <path
                  fill="rgb(229, 231, 235)"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                />
              </svg>
            </div>
          )}
          <div className="text-lg max-md:text-base">{session ? session.user.nickname : ''}</div>
        </div>
        <button>
          <div className="flex text-base px-3 py-1 border border-gray-300 rounded-md max-md:text-sm">
            <Link href={'/mypage/profile-edit'}>프로필 관리</Link>
          </div>
        </button>
      </div>
      <div className="flex flex-col h-full space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl max-md:text-lg">상품 관리</h2>
          <nav className="mb-2">
            <ul className="grid grid-cols-2 items-center bg-gray-100 border-gray-100 border-t border-l border-r">
              <button>
                <li
                  className={`flex justify-center py-2 text-lg max-md:text-base ${
                    productOption == 'selling' ? 'bg-white' : ''
                  }`}
                  onClick={() => {
                    productOption !== 'selling' && setProductOption('selling');
                  }}
                >
                  판매 중
                </li>
              </button>
              <button>
                <li
                  className={`flex justify-center py-2 text-lg  max-md:text-base ${
                    productOption == 'sellCompleted' ? 'bg-white' : ''
                  }`}
                  onClick={() => {
                    productOption !== 'sellCompleted' && setProductOption('sellCompleted');
                  }}
                >
                  판매 완료
                </li>
              </button>
            </ul>
          </nav>
          <div className="grid grid-cols-3 gap-1 min-h-14 max-md:grid-cols-1">
            {productOption == 'selling' && <Selling items={selling} />}
            {productOption == 'sellCompleted' && <SellCompleted items={sellCompleted} />}
          </div>
        </section>
        {/* <section className="">
          <h2 className="text-xl mb-3 max-md:text-lg">게시물 관리</h2>
          <nav className="mb-2">
            <ul className="grid grid-cols-2 bg-gray-100 border-gray-100 border-t border-r border-l">
              <button>
                <li
                  className={`flex justify-center py-2 text-lg ${
                    postOption == 'mypost' ? ' bg-white' : ''
                  } max-md:text-base`}
                  onClick={() => postOption !== 'mypost' && setPostOption('mypost')}
                >
                  내 게시물
                </li>
              </button>
              <button>
                <li
                  className={`flex justify-center py-2 text-lg ${
                    postOption == 'likedpost' ? ' bg-white' : ''
                  } max-md:text-base`}
                  onClick={() => postOption !== 'likedpost' && setPostOption('likedpost')}
                >
                  좋아요
                </li>
              </button>
            </ul>
          </nav>
          <div className="grid grid-cols-5 gap-1 min-h-14 max-md:grid-cols-4 max-[560px]:grid-cols-2">
            {postOption == 'mypost' && <MyPost posts={myPost} />}
            {postOption == 'likedpost' && <LikedPost posts={likedPost} />}
          </div>
        </section> */}
      </div>
    </div>
  );
}
