import { ProductData } from '@/type/productData';
import { User } from '@/type/user';

interface ResponseData {
  provider: 'naver' | 'kakao';
  userProducts: ProductData[];
  userProfile: User;
}

const getUserProducts = async (id: string) => {
  const res = await fetch(`/api/user/${id}/products`, {
    method: 'GET',
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch products');
  }
  const data: ResponseData = await res.json();

  return data;
};

export default getUserProducts;
