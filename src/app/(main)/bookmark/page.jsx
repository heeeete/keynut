'use client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getBookmarkedProducts from './_lib/getBookmarkedProducts';
import Link from 'next/link';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';

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
    e.stopPropagation();
    if (!session) return signIn();
    mutation.mutate({ productId });
  };

  return (
    <button onClick={e => handleBookmarkClick(e)}>
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
  if (!data) {
    return (
      <div className="flex max-w-screen-xl mx-auto px-10 max-md:px-2 justify-center">
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
    );
  }

  return (
    <>
      {data && data.length ? (
        <div className="grid grid-cols-2 gap-2 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:grid-cols-1 max-md:main-768">
          {data.map((item, index) => (
            <div
              className="flex p-2 items-center cursor-pointer relative border border-gray-300 rounded-sm justify-between"
              key={index}
            >
              <div className="flex">
                <div className="flex w-28 min-w-28 aspect-square mr-4 relative bg-gray-100">
                  <Image className="rounded object-cover" src={item.images[0]} alt={item.title} fill sizes="112px" />
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
              <Link
                href={`/shop/product/${item._id}`}
                className="absolute left-0 top-0 w-full h-full rounded"
                onClick={e => {
                  mobile && onClickProduct(e);
                }}
              ></Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex max-w-screen-xl h-70dvh items-center  mx-auto px-10 justify-center text-gray-500 max-md:px-2 ">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20%" height="20%" viewBox="0 0 24 24">
              <path
                fill="lightgray"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m-5 8.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 7 10.5m1.124 6.492l-.248-1.984l8-1l.248 1.984zm7.369-5.006a1.494 1.494 0 1 1 .001-2.987a1.494 1.494 0 0 1-.001 2.987"
              />
            </svg>
            <p>찜한 상품이 없습니다. 상품을 둘러보고 찜해보세요!</p>
          </div>
        </div>
      )}
    </>
  );
}
