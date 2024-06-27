'use client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getBookmarkedProducts from './_lib/getBookmarkedProducts';

const bookmarked = [
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원' },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원' },
  { path: '/키보드3.jpeg', name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', price: '20,5000원' },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원' },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원' },
];

const useBookmarkedProducts = () => {
  return useQuery({
    queryKey: ['bookmarkedProducts'],
    queryFn: () => getBookmarkedProducts(),
  });
};

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
  const handleBookmarkClick = () => {
    if (!session) return signIn();
    mutation.mutate({ productId });
  };

  return (
    <button onClick={handleBookmarkClick}>
      <svg className="min-w-7" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 32 32">
        <path stroke="black" fill="black" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
    </button>
  );
};

export default function Bookmark() {
  const { data, error, isLoading } = useBookmarkedProducts();
  if (!data) {
    return (
      <div className="flex max-w-screen-xl mx-auto px-10 max-md:px-2 justify-center text-gray-500 ">
        찜한 상품을 가져오는 중입니다.
      </div>
    );
  }

  return (
    <>
      {data && data.length ? (
        <div className="grid grid-cols-2 gap-2 max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:grid-cols-1 max-md:main-768">
          {data.map((item, index) => (
            <div className="flex p-2 items-center border border-gray-300 rounded-sm justify-between" key={index}>
              <div className="flex">
                <div className="flex w-28 min-w-28 aspect-square mr-4 relative">
                  <Image className="rounded object-cover" src={item.images[0]} alt={item.title} fill sizes="112px" />
                </div>
                <div className="flex flex-col justify-center pr-5">
                  <p className="break-all line-clamp-2">{item.title}</p>
                  <p>{item.price}</p>
                </div>
              </div>
              <HandleBookMark productId={item._id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex max-w-screen-xl mx-auto px-10 justify-center text-gray-500 max-md:px-2 ">
          찜한 상품이 없습니다. 상품을 둘러보고 찜해보세요!
        </div>
      )}
    </>
  );
}
