'use client';

export default async function adminGetProducts(
  page: number,
  nickname: string,
  keyword: string,
  price: string,
  pageSize: number,
) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(
    `/api/admin/products?offset=${offset}&keyword=${keyword}&nickname=${nickname}&price=${price}&limit=${pageSize}`,
    {
      cache: 'no-store',
    },
  );
  const data = await response.json();

  console.log(data);
  return data;
}
