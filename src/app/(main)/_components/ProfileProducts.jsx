'use client';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import timeAgo from '@/utils/timeAgo';
import ProfileSkeleton from './ProfileSkeleton';
import conditions from '../_constants/conditions';

const Product = ({ product, productOption }) => {
  return (
    <Link
      href={`/shop/product/${product._id}`}
      className="p-2 items-center border cursor-pointer border-gray-300 justify-between rounded-sm relative max-md:border-0 max-md:border-b max-md:p-3 max-md:border-gray-100 max-md:max-h-56"
    >
      <div className="flex">
        <div className="w-56 aspect-square relative mr-4 bg-gray-100">
          <Image
            className="rounded object-cover"
            src={product.images[0]}
            alt={product._id}
            fill
            sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width: 1500px) 20vw, 250px"
          ></Image>
          <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white">
            {conditions[product.condition].option}
          </div>
          {!productOption && (
            <div className="absolute top-0 left-0 z-10 w-full h-full rounded bg-black opacity-70 flex items-center justify-center">
              <p className="font-semibold text-white text-lg max-md:text-base">판매 완료</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center w-full">
          <div className="break-all line-clamp-1 mr-5">{product.title}</div>
          <div className="space-x-1 font-semibold items-center line-clamp-1 break-all">
            <span>{product.price.toLocaleString()}</span>
            <span className="text-sm">원</span>
          </div>
          {/* <p className="text-gray-500 text-xs">{conditions[product.condition].option}</p> */}
        </div>
      </div>
      <div className="flex absolute bottom-2 right-3 space-x-2 items-center text-xs max-md:text-sm">
        <p className="text-gray-400">{timeAgo(product.createdAt)}</p>
        <div className="flex justify-center items-center">
          <div className="max-md:w-4 md:w-3">
            <svg className="" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32">
              <path stroke="lightgray" fill="lightgray" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
            </svg>
          </div>
          <p className=" text-gray-400">{product.bookmarked ? product.bookmarked.length : 0}</p>
        </div>
      </div>
    </Link>
  );
};

export default function ProfileProducts({ data }) {
  const [productOption, setProductOption] = useState(1);
  return (
    <div className="flex flex-col h-full space-y-8">
      <section className="space-y-2">
        <h2 className="text-xl max-md:text-lg max-md:px-3">상품</h2>
        <nav className="mb-2">
          <ul className="grid grid-cols-2 items-center bg-gray-100 border-gray-100 border-t border-l border-r">
            <button>
              <li
                className={`flex justify-center py-2 text-lg space-x-2 max-md:text-base ${
                  productOption == 1 ? 'bg-white text-black' : 'text-gray-400'
                }`}
                onClick={() => {
                  productOption !== 1 && setProductOption(1);
                }}
              >
                <p>판매 중</p>
                <p>{data?.filter(a => a.state === 1).length}</p>
              </li>
            </button>
            <button>
              <li
                className={`flex justify-center py-2 text-lg space-x-2  max-md:text-base ${
                  productOption == 0 ? 'bg-white text-black' : 'text-gray-400'
                }`}
                onClick={() => {
                  productOption !== 0 && setProductOption(0);
                }}
              >
                <p>판매 완료 </p>
                <p>{data?.filter(a => a.state === 0).length}</p>
              </li>
            </button>
          </ul>
        </nav>
        <div className="md:min-h-50vh">
          {data ? (
            data.filter(a => a.state === productOption).length ? (
              <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:gap-0">
                {data
                  .filter(a => a.state === productOption)
                  .map((product, index) => {
                    return (
                      <Fragment key={index}>
                        <Product product={product} productOption={productOption} />
                      </Fragment>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1 md:h-50vh max-md:h-52">
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
            <div className="grid grid-cols-3  gap-3 min-h-14 relative max-md:grid-cols-1 max-md:gap-0">
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
}