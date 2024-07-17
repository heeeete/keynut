'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// import MyPost from './_components/MyPost';
// import LikedPost from './_components/LikedPost';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';
import { useQuery } from '@tanstack/react-query';

const MyProfile = React.memo(({ mobile, data, session }) => {
  return (
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
        <div className="text-lg max-md:text-base">
          {session?.user.nickname ? session.user.nickname : data?.nickname}
        </div>
      </div>
      <button>
        <Link
          className="flex text-base px-3 py-1 border border-gray-300 rounded-md max-md:text-sm"
          href={'/mypage/profile-edit'}
          onClick={e => mobile && onClickProduct(e)}
        >
          프로필 관리
        </Link>
      </button>
    </div>
  );
});

export default function MyPage() {
  const { data: session, status } = useSession();
  const [productOption, setProductOption] = useState(1);
  const mobile = isMobile();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      <MyProfile mobile={mobile} data={data?.userProfile} session={session} />
      {/* 카카오 API */}
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
          <div>
            {data ? (
              <div className="grid grid-cols-3 gap-1 min-h-14 max-md:grid-cols-1">
                {data.userProducts
                  .filter(a => a.state === productOption)
                  .map((product, index) => {
                    return (
                      <div
                        className="p-2 items-center border cursor-pointer border-gray-300 justify-between max-md:border-0 max-md:border-b rounded-sm relative max-md:border-gray-200"
                        key={index}
                      >
                        {!productOption && (
                          <Link
                            href={`/shop/product/${product._id}`}
                            className="absolute top-0 left-0 z-10 w-full h-full rounded bg-black opacity-70 flex items-center justify-center"
                          >
                            <p className="font-semibold text-white text-lg">판매 완료</p>
                          </Link>
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
                        <Link
                          href={`/shop/product/${product._id}`}
                          className="absolute top-0 left-0 w-full h-full rounded"
                          onClick={e => mobile && onClickProduct(e)}
                        ></Link>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex w-full h-full items-center justify-center ">
                <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
                  <path
                    fill="#a599ff"
                    d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                    opacity="0.5"
                  />
                  <path fill="#a599ff" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                    <animateTransform
                      attributeName="transform"
                      dur="1.5s"
                      from="0 12 12"
                      repeatCount="indefinite"
                      to="360 12 12"
                      type="rotate"
                    />
                  </path>
                </svg>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
