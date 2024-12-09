import ProductData from '@keynut/type/productData';

const getBookmarkedProducts = async () => {
  const res = await fetch('/api/bookmark', {
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch bookmarked products');
  }
  const data: ProductData[] = await res.json();
  return data;
};

export default getBookmarkedProducts;
