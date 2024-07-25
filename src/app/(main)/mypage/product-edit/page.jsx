'use client';
import getUserProducts from '@/lib/getUserProducts';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Fragment, useState } from 'react';

const Product = ({ product }) => {
  return (
    <tr className="text-center border-b">
      <td className="py-3">
        <div className="max-w-48 aspect-square relative bg-gray-100">
          <Image
            className="rounded object-cover"
            src={product.images[0]}
            alt={product._id}
            fill
            sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width:1500px) 20vw, 250px"
          />
        </div>
      </td>
      <td>
        <p className="line-clamp-1 break-all px-2 text-center">{product.title}</p>
      </td>
      <td>
        <p className="inline-flex items-center line-clamp-1 break-all w-40 px-2 justify-center">
          {product.price.toLocaleString()}원
        </p>
      </td>
      <td>{product.bookmarked ? product.bookmarked.length : 0}</td>
      <td className="">
        <div className="inline-flex p-1 bg-slate-200 border rounded-sm whitespace-nowrap">
          <button className={`${product.state === 1 ? 'bg-white' : 'opacity-30'} p-1 rounded-s-sm`}>판매중</button>
          <button className={`${product.state === 0 ? 'bg-white' : 'opacity-30'} p-1 rounded-e-sm`}>판매완료</button>
        </div>
      </td>
      <td>
        <div className="flex justify-around max-md:hidden">
          <button className="px-2 font-medium">up</button>
          <button className="px-2 font-medium">수정</button>
          <button className="px-2 text-red-400 font-medium">삭제</button>
        </div>
      </td>
    </tr>
  );
};

export default function ProductEdit() {
  const { data: session, status } = useSession();
  const [productState, setProductState] = useState(2);
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  return <div></div>;

  return (
    <div className="flex justify-start flex-col max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:main-768">
      <table className="max-md:text-sm border-spacing-0 border-separate">
        <thead className="sticky top-28 bg-white max-md:top-12 z-40">
          <tr className="">
            <th className="py-1 min-w-20 border-y border-black" style={{ width: '12%' }}>
              <div>사진</div>
            </th>
            <th className="border-y border-black" style={{ width: '20%' }}>
              <div>제목</div>
            </th>
            <th className="border-y border-black" style={{ width: '10%' }}>
              <div>가격</div>
            </th>
            <th className="border-y border-black" style={{ width: '12%' }}>
              <div>찜</div>
            </th>
            <th className="border-y border-black" style={{ width: '15%' }}>
              <div>상태</div>
            </th>
            <th className="border-y border-black" style={{ width: '20%' }}>
              <div>설정</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.userProducts
            ? productState !== 2
              ? data.userProducts
                  .filter(a => a.state === productState)
                  .map((product, idx) => (
                    <Fragment key={idx}>
                      <Product product={product} />
                    </Fragment>
                  ))
              : data.userProducts.map((product, idx) => (
                  <Fragment key={idx}>
                    <Product product={product} />
                  </Fragment>
                ))
            : ''}
        </tbody>
      </table>
    </div>
  );
}
