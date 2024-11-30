'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getRecentProducts from '../_lib/getRecentProducts';
import { ProductData } from '@/type/productData';
import ModelViewer from './ModelViewerComponent/ModelViewer';
import ProductImage from './ProductImage';
import ProductTitleAndPrice from './ProductTitleAndPrice';

const JustInProduct = ({ product }) => {
  return (
    <Link
      href={`/shop/product/${product._id}`}
      className="flex flex-col cursor-pointer relative max-md:max-w-40 max-md:w-40 max-md:text-sm"
      key={product._id}
    >
      <ProductImage product={product} />
      <ProductTitleAndPrice product={product} />
    </Link>
  );
};

const MoreButton = () => {
  return (
    <Link href={'/shop'} aria-label="more" className="rounded">
      <div className="flex items-center font-medium text-sm text-gray-500 px-0.5">더보기</div>
    </Link>
  );
};

const JustIn = () => {
  const { data, error, isLoading } = useQuery<ProductData[]>({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
    staleTime: Infinity,
  });

  return (
    <section className="flex flex-col space-y-5">
      <div className="flex items-end">
        <div className="flex flex-1 flex-col bg-re">
          <div className="font-medium text-xl">just in</div>
          <div className="text-gray-500 font-medium">신규 등록 상품</div>
        </div>
        <MoreButton />
      </div>
      <div className={`grid grid-cols-5 gap-2 overflow-auto scrollbar-hide max-md:flex`}>
        {data?.map((product, idx) => (
          <JustInProduct product={product} />
        ))}
      </div>
    </section>
  );
};

const CategoryButton = ({ children, category_number, category_label, category_name, button_color }) => {
  return (
    <li className="flex flex-col items-center space-y-1">
      <Link href={`/shop?categories=${category_number}`} aria-label={`${category_label} category`}>
        <div className={`category-button ${button_color} max-md:w-24`}>{children}</div>
      </Link>
      <p className="text-gray-600">{category_name}</p>
    </li>
  );
};

const Categories = () => {
  return (
    <section className="flex flex-col space-y-5">
      <div className="flex flex-col">
        <div className="font-medium text-xl">cateory</div>
        <div className="text-gray-500 font-medium">카테고리</div>
      </div>
      <ul className="flex space-x-3 overflow-auto scrollbar-hide">
        <CategoryButton
          category_number={1}
          category_label={'keyboard'}
          category_name={'키보드'}
          button_color={'bg-gray-100'}
        >
          <Image className="max-md:w-16" src="/keyboard.svg" width={80} height={80} alt="keyboard" />
        </CategoryButton>
        <CategoryButton
          category_number={2}
          category_label={'mouse'}
          category_name={'마우스'}
          button_color={'bg-slate-100'}
        >
          <Image className="max-md:w-9" src="/mouse.svg" width={45} height={45} alt="mouse" />
        </CategoryButton>
        <CategoryButton category_number={3} category_label={'pad'} category_name={'패드'} button_color={'bg-gray-100'}>
          <Image className="max-md:w-16" src="/pad.svg" width={60} height={50} alt="pad" />
        </CategoryButton>
        <CategoryButton
          category_number={4}
          category_label={'monitor'}
          category_name={'모니터'}
          button_color={'bg-slate-100'}
        >
          <Image className="max-md:w-12" src="/monitor.svg" width={50} height={40} alt="monitor" />
        </CategoryButton>
        <CategoryButton
          category_number={5}
          category_label={'headset'}
          category_name={'헤드셋'}
          button_color={'bg-gray-100'}
        >
          <Image className="max-md:w-12" src="/headset.svg" width={50} height={40} alt="headset" />
        </CategoryButton>
        <CategoryButton
          category_number={9}
          category_label={'others'}
          category_name={'기타'}
          button_color={'bg-slate-100'}
        >
          <Image className="max-md:w-10" src="/others.svg" width={45} height={45} alt="others" />
        </CategoryButton>
      </ul>
    </section>
  );
};

export default function RenderHome() {
  return (
    <div className="flex flex-col w-full min-h-80vh md:-mt-4 max-[960px]:pt-12">
      <div className="max-h-50vh h-100vh max-md:h-20vh">
        <ModelViewer />
      </div>
      <div className="w-full max-w-screen-xl mx-auto px-10  space-y-12 mb-10 max-md:px-3 ">
        <Categories />
        <JustIn />
      </div>
    </div>
  );
}
