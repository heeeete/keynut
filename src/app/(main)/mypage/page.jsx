'use client';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';

// import MyPost from './_components/MyPost';
// import LikedPost from './_components/LikedPost';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';
import { useQuery } from '@tanstack/react-query';
import ProfileSkeleton from '../_components/ProfileSkeleton';

const MyProfile = React.memo(({ mobile, session }) => {
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
                fill="rgba(0,0,0,0.2)"
                d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
              />
            </svg>
          </div>
        )}
        {session?.user.nickname ? (
          <div className="text-lg max-md:text-base">{session.user.nickname}</div>
        ) : (
          <div className="h-6 w-32 bg-gray-100 relative rounded-sm">
            <div className="absolute top-0 left-0 h-full w-full animate-loading">
              <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
            </div>
          </div>
        )}
      </div>
      <button>
        <Link
          className="flex text-base px-3 py-1 border border-gray-300 rounded-md max-md:text-sm "
          href={'/mypage/profile-edit'}
          onClick={e => mobile && onClickProduct(e)}
        >
          프로필 관리
        </Link>
      </button>
    </div>
  );
});

const MyProducts = ({ data, mobile }) => {
  const [productOption, setProductOption] = useState(1);
  return (
    <div className="flex flex-col h-full space-y-8">
      <section className="space-y-3">
        <h2 className="text-xl max-md:text-lg">상품 관리</h2>
        <nav className="mb-2">
          <ul className="grid grid-cols-2 items-center bg-gray-100 border-gray-100 border-t border-l border-r">
            <button>
              <li
                className={`flex justify-center py-2 text-lg max-md:text-base ${productOption == 1 ? 'bg-white' : ''}`}
                onClick={() => {
                  productOption !== 1 && setProductOption(1);
                }}
              >
                판매 중
              </li>
            </button>
            <button>
              <li
                className={`flex justify-center py-2 text-lg  max-md:text-base ${productOption == 0 ? 'bg-white' : ''}`}
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
            data.filter(a => a.state === productOption).length ? (
              <div className="grid grid-cols-3 gap-1 min-h-14 max-md:grid-cols-1">
                {data
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
              <div className="flex flex-col items-center h-44 justify-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
                  <path
                    fill="lightgray"
                    d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
                  />
                </svg>
                <p className="text-gray-300 font-medium">
                  {productOption === 1 ? '판매 중인 상품이 없습니다' : '판매 완료된 상품이 없습니다'}
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-3 gap-1 min-h-14 relative max-md:grid-cols-1">
              {Array.from({ length: 30 }).map((_, index) => (
                <Fragment key={index}>
                  <ProfileSkeleton />
                </Fragment>
              ))}
              <div className="absolute top-0 left-0 h-full w-full animate-loading">
                <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default function MyPage() {
  const { data: session, status } = useSession();
  const mobile = isMobile();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-3 max-md:main-768">
      <MyProfile mobile={mobile} data={data?.userProfile} session={session} />
      {/* 카카오 API */}
      <MyProducts data={data?.userProducts} mobile={mobile} />
    </div>
  );
}
