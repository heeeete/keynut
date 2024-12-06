import { ProductData } from '@keynut/type';

const getRecentProducts = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/products/recent`, {
      next: { tags: ['products'] },
    });
    if (!res.ok) {
      console.error('API 요청 실패:', res.status, res.statusText);
      throw new Error('Failed to fetch products');
    }
    const data: ProductData[] = await res.json();
    return data;
  } catch (error) {
    console.error('recent Products prefetchQuery 실행 중 에러 발생:', error);
    throw error;
  }
};

export default getRecentProducts;
