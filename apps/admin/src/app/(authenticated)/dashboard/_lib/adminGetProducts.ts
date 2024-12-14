'use client';

import productData from '@keynut/type/productData';

interface ExtendedProductData extends productData {
  nickname: string;
}

interface Data {
  products: ExtendedProductData[];
  total: number;
}

export default async function adminGetProducts(
  page: number,
  nickname: string,
  keyword: string,
  price: string,
  pageSize: number,
) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(
    `/api/products?offset=${offset}&keyword=${keyword}&nickname=${nickname}&price=${price}&limit=${pageSize}`,
    {
      cache: 'no-store',
    },
  );
  const data: Data = await response.json();
  return data;
}
