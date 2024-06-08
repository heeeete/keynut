'use client';
import Image from 'next/image';
import { useState } from 'react';
import Selling from './_components/Selling';
import SellCompleted from './_components/SellCompleted';
import MyPost from './_components/MyPost';
import LikedPost from './_components/LikedPost';

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

export default function MyPage() {
  const [productOption, setProductOption] = useState('selling');
  const [postOption, setPostOption] = useState('mypost');
  const [nickname, setNickname] = useState('우유먹은송아지');
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex flex-col h-full max-w-screen-xl mx-auto px-10 max-md:px-2">
      <div className="flex h-24 border border-gray-300 rounded-md items-center my-5 px-4 max-md:px-2">
        <div className="rounded-full w-20 aspect-square relative max-md:w-16">
          <Image className="rounded-full" src="/키보드1.webp" alt="myprofile" fill />
        </div>
        <div className="flex w-full items-center justify-between pl-4 max-md:flex-col max-md:items-start max-md:space-y-1">
          <div className="text-lg max-md:text-base">
            {!isEditing ? (
              nickname
            ) : (
              <input
                className="border-b outline-none"
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                autoFocus
              />
            )}
          </div>
          <button>
            <div
              className="flex text-base px-3 py-1 border border-gray-300 rounded-md max-md:text-sm"
              onClick={() => {
                !isEditing ? setIsEditing(true) : setIsEditing(false);
              }}
            >
              {isEditing ? '완료' : '프로필 수정'}
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full space-y-10">
        <section className="">
          <h2 className="text-xl mb-2 max-md:text-lg">상품 관리</h2>
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
        <section className="">
          <h2 className="text-xl mb-2 max-md:text-lg">게시물 관리</h2>
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
        </section>
      </div>
    </div>
  );
}
