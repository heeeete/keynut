'use client';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { RecentViewContext } from './RecentViewContext';
import Link from 'next/link';
import ProductData from '@keynut/type/productData';

type SetRecentViewType = React.Dispatch<React.SetStateAction<ProductData[]>>;

const deleteViewProduct = (id: string, setRecentView: SetRecentViewType) => {
  const prev = JSON.parse(localStorage.getItem('recentView') || '[]');

  const updated = prev.filter((data: ProductData) => data._id !== id);

  localStorage.setItem('recentView', JSON.stringify(updated));
  setRecentView(updated);
};

interface ImageProps {
  name: string;
  width: number;
  height: number;
}

const RecentViewImage = ({ images }: { images: ImageProps[] }) => {
  return (
    <div className="w-16 aspect-square relative">
      <Image
        className="object-cover"
        src={
          images.length
            ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${images[0]!.name}`
            : '/noImage.svg'
        }
        alt="이미지"
        fill
        sizes="200px"
      />
    </div>
  );
};

const RecentViewTitleAndPrice = ({
  product,
  setRecentView,
}: {
  product: ProductData;
  setRecentView: SetRecentViewType;
}) => {
  return (
    <div className="hidden group-hover:flex flex-col justify-center text-sm absolute right-16 top-0 w-32 h-full border border-r-0 bg-white p-2">
      <p className="break-all line-clamp-1">{product.title}</p>
      <div className="space-x-1 break-all line-clamp-1 font-semibold">
        <span className="">{product.price.toLocaleString()}</span>
        <span className="text-sm">원</span>
      </div>
      <button
        className="absolute bg-black -top-1 -left-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteViewProduct(product._id, setRecentView);
        }}
      >
        <Image src="/close.svg" alt="deleteRecentView" width={15} height={15} />
      </button>
    </div>
  );
};

const RecentViewProduct = ({
  product,
  setRecentView,
}: {
  product: ProductData;
  setRecentView: SetRecentViewType;
}) => {
  return (
    <Link className="relative group" key={product._id} href={`/shop/product/${product._id}`}>
      <RecentViewImage images={product.images} />
      <RecentViewTitleAndPrice product={product} setRecentView={setRecentView} />
    </Link>
  );
};

const RecentViewProducts = () => {
  const context = useContext(RecentViewContext);
  if (!context) throw new Error('');
  const { recentViewChange, setRecentViewChange } = context;
  const [recentView, setRecentView] = useState<ProductData[]>([]);

  useEffect(() => {
    let cur = localStorage.getItem('recentView');
    if (cur && cur.length) setRecentView(JSON.parse(cur));
    else setRecentView([]);
    setRecentViewChange(false);
  }, [recentViewChange]);

  return (
    <div className="flex flex-col w-24 min-h-30 p-2 rounded-md border bg-white border-gray-300 items-center max-[960px]:hidden">
      <p className="px-2 pb-1 mb-2 text-xs border-b text-gray-700 font-semibold">최근 본 상품</p>
      <div className="flex flex-col space-y-3">
        {recentView && recentView.length ? (
          recentView.map((product) => (
            <Fragment key={product._id}>
              <RecentViewProduct product={product} setRecentView={setRecentView} />
            </Fragment>
          ))
        ) : (
          <div className="p-5">
            <Image src="/emptyRecentView.svg" alt="emptyView" height={30} width={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentViewProducts;
