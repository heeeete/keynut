'use client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getBookmarkedProducts from './_lib/getBookmarkedProducts';
import Link from 'next/link';
// import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';
import { Fragment } from 'react';

const HandleBookMark = ({ productId }) => {
  const { data: session, status } = useSession();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ productId }) => {
      const res = await fetch(`/api/products/${productId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBookmarked: true }),
      });
      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      const data = await res.json();
      return data;
    },
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries(['bookmarkedProducts']);
      const previousProduct = queryClient.getQueryData(['bookmarkedProducts']);
      queryClient.setQueryData(['bookmarkedProducts'], old => {
        return old.filter(product => product._id !== productId);
      });
      return { previousProduct };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['bookmarkedProducts', context.previousProduct]);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['bookmarkedProducts']);
    },
  });
  const handleBookmarkClick = e => {
    e.preventDefault();
    if (!session) return signIn();
    mutation.mutate({ productId });
  };

  return (
    <button onClick={e => handleBookmarkClick(e)} className="p-1">
      <svg className="min-w-7" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 32 32">
        <path stroke="black" fill="black" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
    </button>
  );
};

export default function Bookmark() {
  const mobile = isMobile();

  const { data, error, isLoading } = useQuery({
    queryKey: ['bookmarkedProducts'],
    queryFn: () => getBookmarkedProducts(),
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-2 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:grid-cols-1 max-md:main-768">
        {Array.from({ length: 20 }).map((_, index) => (
          <Fragment key={index}>
            <div className="flex p-2 items-center border border-gray-300 rounded-sm justify-between" key={index}>
              <div className="flex">
                <div className="flex w-28 min-w-28 aspect-square mr-4 relative bg-gray-100"></div>
                <div className="flex flex-col justify-center pr-5 space-y-1">
                  <div className="h-5 w-36 bg-gray-100"></div>
                  <div className="space-x-1 items-center h-5 w-32 bg-gray-100"></div>
                </div>
              </div>
              <svg
                className="min-w-7"
                xmlns="http://www.w3.org/2000/svg"
                width="28px"
                height="28px"
                viewBox="0 0 32 32"
              >
                <path stroke="#f3f4f6" fill="#f3f4f6" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
              </svg>
            </div>
          </Fragment>
        ))}
        <div className="absolute top-0 left-0 h-full w-full animate-loading">
          <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.length ? (
        <div className="grid grid-cols-2 gap-2 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:grid-cols-1 max-md:main-768">
          {data.map((item, index) => (
            <Link
              href={`/shop/product/${item._id}`}
              className="flex p-2 items-center cursor-pointer border border-gray-300 rounded-sm justify-between"
              key={index}
            >
              <div className="flex">
                <div className="flex w-28 min-w-28 aspect-square mr-4 relative bg-gray-100">
                  <Image className="rounded object-cover" src={item.images[0]} alt={item.title} fill sizes="200px" />
                </div>
                <div className="flex flex-col justify-center pr-5">
                  <p className="break-all line-clamp-1">{item.title}</p>
                  <div className="space-x-1 font-semibold items-center line-clamp-1 break-all">
                    <span>{item.price.toLocaleString()}</span>
                    <span className="text-sm">원</span>
                  </div>
                </div>
              </div>
              <HandleBookMark productId={item._id} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex max-w-screen-xl items-center mx-auto px-10 h-72 justify-center text-gray-500 max-md:px-2 max-md:custom-dvh">
          <div className="flex flex-col justify-center items-center space-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
              <path
                fill="lightgray"
                d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
              />
            </svg>
            <p className="text-gray-300 font-medium">찜한 상품이 없습니다. 상품을 둘러보고 찜해보세요!</p>
          </div>
        </div>
      )}
    </>
  );
}
