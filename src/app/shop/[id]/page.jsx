'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

import Link from 'next/link';

const getProducts = async (id, setProducts) => {
  const res = await fetch(`/api/user/${id}/products`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }
  const data = await res.json();
  setProducts(data);
};

const getUserProfile = async (id, setUserProfile) => {
  const res = await fetch(`/api/user/${id}/profile`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }
  const data = await res.json();
  setUserProfile(data);
};

export default function Profile() {
  const [products, setProducts] = useState([]);
  const [productOption, setProductOption] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    getProducts(id, setProducts);
    getUserProfile(id, setUserProfile);
  }, []);

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      <div className="flex h-24 border border-gray-300 rounded-md items-center px-4 max-md:px-2">
        <div className="flex flex-1 items-center space-x-5">
          {userProfile && userProfile.image ? (
            <div className="flex rounded-full w-20 aspect-square relative justify-center items-center border max-md:w-16 ">
              <Image
                className="rounded-full object-cover"
                src={userProfile.image}
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
          <div className="text-lg max-md:text-base">
            {userProfile && userProfile.nickname ? userProfile.nickname : ''}
          </div>
        </div>
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
                      <div
                        className="p-2 items-center border border-gray-300 justify-between rounded-sm max-md:border-0 max-md:border-b max-md:border-gray-200"
                        onClick={() => {
                          router.push(`/shop/product/${product._id}`);
                        }}
                        key={index}
                      >
                        {!productOption && (
                          <div className="absolute top-0 left-0 z-10 w-full h-full rounded-sm bg-black opacity-70 flex items-center justify-center">
                            <p className="font-semibold text-white text-lg">판매 완료</p>
                          </div>
                        )}
                        <div className="flex">
                          <div className="w-48 aspect-square relative mr-4 max-md:w-34 max-md:min-w-34">
                            <Image
                              className="rounded object-cover"
                              src={product.images[0]}
                              alt={index}
                              fill
                              sizes="(max-width:768px) 136px,(max-width:1280px) 13vw, (max-width: 1500px) 20vw, 123px"
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
                      </div>
                    );
                  })
              : ''}
          </div>
        </section>
      </div>
    </div>
  );
}
