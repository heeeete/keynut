'use client';
import getUserProducts from '@/lib/getUserProducts';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export default function ProductEdit() {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });
  if (data) {
    console.log(data.userProducts);
  }
  return (
    <div className="flex justify-start flex-col max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      <p className="mb-2">전체 {data?.userProducts.length}</p>
      <div className="sticky top-28 flex justify-between items-center border-y border-black font-medium bg-white z-50 py-1 max-md:top-12">
        <p className="flex w-40 justify-center ">사진</p>
        <p className="flex w-60 justify-center ">제목</p>
        <p className="flex w-40 justify-center">가격</p>
        <p className="flex w-40 justify-center">상태</p>
        <p className="flex justify-center w-60">설정</p>
      </div>
      <ul className="flex flex-col">
        {data?.userProducts
          ? data.userProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center border-b py-3">
                <div className="w-40 aspect-square relative mr-4 bg-gray-100">
                  <Image
                    className="rounded object-cover"
                    src={product.images[0]}
                    alt={idx}
                    fill
                    sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width: 1500px) 20vw, 250px"
                  ></Image>
                </div>
                <p className="line-clamp-1 break-all w-60 px-2">{product.title}</p>
                <div className="flex items-center line-clamp-1 break-all w-40 px-2 justify-center">
                  <span>{product.price.toLocaleString()}</span>
                  <span className="">원</span>
                </div>
                <div className="flex w-40 px-2 justify-center">
                  <div className="space-x-1 bg-slate-200 p-1 rounded-sm">
                    <button className={`${product.state === 1 ? 'bg-white' : 'opacity-30'} p-1 rounded-s-sm`}>
                      판매중
                    </button>
                    <button className={`${product.state === 0 ? 'bg-white' : 'opacity-30'} p-1 rounded-e-sm`}>
                      판매완료
                    </button>
                  </div>
                </div>
                {/* <div className="flex-col md:hidden">
                  <p className="line-clamp-1 break-all w-60 px-2">{product.title}</p>
                  <div className="flex">
                    <div className="flex space-x-1 items-center line-clamp-1 break-all px-2 justify-center">
                      <span>{product.price.toLocaleString()}</span>
                      <span className="">원</span>
                    </div>
                    <div className="flex px-2 justify-center">
                      <div className="p-1 border">{product.state === 1 ? '판매중' : '판매완료'}</div>
                    </div>
                  </div>
                </div> */}
                <div className="flex w-60 justify-around max-md:hidden">
                  <button className="px-2 font-medium">up</button>
                  <button className="px-2 font-medium">수정</button>
                  <button className="px-2 text-red-400 font-medium">삭제</button>
                </div>
                <img src="/product/more.svg" width={24} height={24} alt="MORE" className="md:hidden" />
              </div>
            ))
          : ''}
      </ul>
    </div>
  );
}
