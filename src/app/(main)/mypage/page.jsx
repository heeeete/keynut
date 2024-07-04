'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// import MyPost from './_components/MyPost';
// import LikedPost from './_components/LikedPost';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import getUserProfile from '@/lib/getUserProfile';

// const getProducts = async (id, setProducts) => {
//   const res = await fetch(`/api/user/${id}/products`, {
//     method: 'GET',
//   });
//   if (!res.ok) {
//     throw new Error(data.error || 'Network response was not ok');
//   }
//   const data = await res.json();
//   setProducts(data);
// };

export default function MyPage() {
  const { data: session, status } = useSession();
  // console.log(session);
  const [products, setProducts] = useState([]);
  const [productOption, setProductOption] = useState(1);
  const [nickname, setNickname] = useState('');
  // const [postOption, setPostOption] = useState('');
  const router = useRouter();
  const fetchProducts = async () => {
    const product = await getUserProducts(session.user.id);
    setProducts(product);
  };

  const fetchNickname = async () => {
    const profile = await getUserProfile(session.user.id);
    setNickname(profile.nickname);
  };

  useEffect(() => {
    if (session) {
      fetchProducts();
      if (!session.user.nickname) {
        fetchNickname();
      } else setNickname(session.user.nickname);
    }
  }, [session]);

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      {/* 카카오 API */}

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
            <div className="w-20 h-20 defualt-profile max-md:w-16 max-md:h-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                <path
                  fill="rgb(229, 231, 235)"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                />
              </svg>
            </div>
          )}
          <div className="text-lg max-md:text-base">{nickname}</div>
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
                    productOption == 1 ? 'bg-white' : ''
                  }`}
                  onClick={() => {
                    productOption !== 1 && setProductOption(1);
                  }}
                >
                  판매 중
                </li>
              </button>
              <button>
                <li
                  className={`flex justify-center py-2 text-lg  max-md:text-base ${
                    productOption == 0 ? 'bg-white' : ''
                  }`}
                  onClick={() => {
                    productOption !== 0 && setProductOption(0);
                  }}
                >
                  판매 완료
                </li>
              </button>
            </ul>
          </nav>
          <div className="grid grid-cols-3 gap-1 min-h-14 max-md:grid-cols-1">
            {products.length
              ? products
                  .filter(a => a.state === productOption)
                  .map((product, index) => {
                    return (
                      <Link
                        href={`/shop/product/${product._id}`}
                        className="p-2 items-center border cursor-pointer border-gray-300 justify-between max-md:border-0 max-md:border-b rounded-sm relative max-md:border-gray-200"
                        key={index}
                      >
                        {!productOption && (
                          <div className="absolute top-0 left-0 z-10 w-full h-full rounded-sm bg-black opacity-70 flex items-center justify-center">
                            <p className="font-semibold text-white text-lg">판매 완료</p>
                          </div>
                        )}
                        <div className="flex">
                          <div className="w-48 aspect-square relative mr-4 bg-gray-100">
                            <Image
                              className="rounded object-cover"
                              src={product.images[0]}
                              alt={index}
                              fill
                              sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width: 1500px) 20vw, 250px"
                            ></Image>
                          </div>
                          <div className="flex flex-col justify-center w-full">
                            <div className="break-all line-clamp-2">{product.title}</div>
                            <div className="space-x-1 font-semibold items-center line-clamp-1 break-all">
                              <span>{product.price.toLocaleString()}</span>
                              <span className="text-sm">원</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
              : ''}
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
