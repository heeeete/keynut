'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import ImageSlider from '@/app/_components/ImageSlider';
import Image from 'next/image';
import timeAgo from '@/app/utils/timeAgo';
import OpenChatLink from './OpenChatLink';
import { useQuery } from '@tanstack/react-query';
import getProductWithUser from '../_lib/getProductWithUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';

const RenderCondition = ({ condition }) => {
  if (condition === 1) condition = '미사용';
  else if (condition === 2) condition = '사용감 없음';
  else if (condition === 3) condition = '사용감 적음';
  else if (condition === 4) condition = '사용감 많음';
  else if (condition === 5) condition = '고장 / 파손';

  return (
    <div className="flex space-x-4 justify-center items-center">
      <div className="flex  items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        <span>상품상태</span>
      </div>
      <span>{condition}</span>
    </div>
  );
};

const RenderInfo = React.memo(({ category }) => {
  const obj = {
    10: '하우징',
    11: '스위치',
    12: '보강판',
    13: '아티산',
    14: '키캡',
    15: 'PCB',
    19: '기타',
    29: '기타',
    99: '기타',
  };
  let mainCategory = '';

  if (category >= 10 && category <= 19) mainCategory = '키보드';
  else if (category >= 20 && category <= 29) mainCategory = '마우스';
  else mainCategory = '기타';

  return (
    <span className="flex items-center text-gray-400 text-sm px-10 max-md:px-2">
      <Link href={`/shop?categories=${~~(category / 10)}`}>{mainCategory}</Link>
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
        <g fill="none" fillRule="evenodd">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
          <path
            fill="#ababab"
            d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
          />
        </g>
      </svg>
      <Link href={`/shop?categories=${category}`}>{obj[category]}</Link>
    </span>
  );
});

RenderInfo.displayName = 'RenderInfo';

const RenderTimeAgo = ({ date }) => {
  return <p>{timeAgo(date)}</p>;
};

const RenderBookMark = ({ bookmarked }) => {
  return (
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 32 32">
        <path fill="grey" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
      <p>{bookmarked.length}</p>
    </div>
  );
};

const RenderProfile = ({ user, product }) => {
  return (
    <>
      <div className="flex max-w-md justify-between border rounded flex-wrap  max-md:px-2 ">
        <div className="flex items-center">
          <div className="flex rounded-full w-12 aspect-square justify-center items-center">
            {user.image ? (
              <Image className="rounded-full" src={user.image} alt="profile" fill />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 32 32">
                <path
                  fill="grey"
                  d="M16 16a7 7 0 1 0 0-14a7 7 0 0 0 0 14m-8.5 2A3.5 3.5 0 0 0 4 21.5v.5c0 2.393 1.523 4.417 3.685 5.793C9.859 29.177 12.802 30 16 30s6.14-.823 8.315-2.207C26.477 26.417 28 24.393 28 22v-.5a3.5 3.5 0 0 0-3.5-3.5z"
                />
              </svg>
            )}
          </div>
          <div className="text-lg max-md:text-base line-clamp-1">{user.nickname}</div>
        </div>
        <button className="mr-2">
          <div className=" text-base border border-gray-300 rounded max-md:text-sm line-clamp-1">상점 가기</div>
        </button>
      </div>
    </>
  );
};

const RenderBookmarkButton = ({ productId, bookmarked, session }) => {
  const queryClient = useQueryClient();

  const isBookmarked = session && bookmarked.includes(session.user.id);
  const color = isBookmarked ? 'black' : 'white';

  const mutation = useMutation({
    mutationFn: async ({ productId }) => {
      const res = await fetch(`/api/products/${productId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBookmarked }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      return data;
    },
    onMutate: async ({ productId, isBookmarked }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({
        ...old,
        bookmarked: isBookmarked
          ? old.bookmarked.filter(id => id !== session.user.id)
          : [...old.bookmarked, session.user.id],
      }));
      return { previousProduct };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['product', variables.productId], context.previousProduct);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });

  const handleClick = () => {
    if (!session) return signIn();
    mutation.mutate({ productId, isBookmarked });
  };

  return (
    <button onClick={handleClick} className="flex justify-end items-center w-10 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 32 32">
        <path fill={color} stroke="black" strokeWidth={3} d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
    </button>
  );
};

const RenderHashTag = ({ product }) => {
  return (
    <div className="space-y-0 flex text-gray-500 flex-wrap">
      {product.tags.map((e, idx) => (
        <Link href={`/shop?keyword=${encodeURIComponent(e)}`} key={idx} className="flex items-center mr-3">
          <span>{e}</span>
        </Link>
      ))}
    </div>
  );
};

const RenderDescriptor = ({ product }) => {
  return (
    <div className="border px-3 py-1 rounded min-h-24">
      <p className="whitespace-pre-wrap">{product.description}</p>
    </div>
  );
};

export default function RenderProduct({ id }) {
  const { data: session, status } = useSession();
  const { data: data, error } = useQuery({ queryKey: ['product', id], queryFn: () => getProductWithUser(id) });

  if (error) return <div>Error loading product</div>;
  if (!data) return <div>Loading...</div>;

  const { user, ...product } = data;

  const writer = status !== 'loading' && session ? session.user.id === product.userId : false;

  return (
    <div className="max-w-screen-xl mx-auto max-md:main-768">
      <RenderInfo category={Number(product.category)} />
      <ImageSlider images={product.images} />
      <div className="p-10 space-y-6 max-md:px-2">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">{product.title}</p>
          <div className="flex">
            {writer ? (
              <Link href={`/shop/product/${id}/edit`} className="flex items-center text-gray-500 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                    fill="grey"
                    fillRule="evenodd"
                    d="M3.25 22a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75"
                    clipRule="evenodd"
                  />
                  <path
                    fill="grey"
                    d="m11.52 14.929l5.917-5.917a8.232 8.232 0 0 1-2.661-1.787a8.232 8.232 0 0 1-1.788-2.662L7.07 10.48c-.462.462-.693.692-.891.947a5.24 5.24 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-1.088 3.267a.848.848 0 0 0 1.073 1.073l3.266-1.088c.62-.207.93-.31 1.221-.45a5.19 5.19 0 0 0 .969-.598c.255-.199.485-.43.947-.891m7.56-7.559a3.146 3.146 0 0 0-4.45-4.449l-.71.71l.031.09c.26.749.751 1.732 1.674 2.655A7.003 7.003 0 0 0 18.37 8.08z"
                  />
                </svg>
                수정
              </Link>
            ) : (
              <>
                <OpenChatLink url={product.openChatUrl} />
                <RenderBookmarkButton productId={id} bookmarked={product.bookmarked} session={session} />
              </>
            )}
          </div>
        </div>
        <RenderHashTag product={product} />
        <p className="space-x-2">
          <span className="text-2xl font-bold">{Number(product.price).toLocaleString()}</span>
          <span className="text-xl">원</span>
        </p>
        <div className="flex w-full justify-between text-sm text-slate-500 font-semibold">
          <RenderCondition condition={Number(product.condition)} />
          <div className="flex space-x-2 font-normal">
            <RenderTimeAgo date={product.createdAt} />
            <RenderBookMark bookmarked={product.bookmarked} />
          </div>
        </div>
        <RenderProfile user={user} product={product} />
        <RenderDescriptor product={product} />
      </div>
    </div>
  );
}
