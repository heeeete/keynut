import { UserData } from '@/type/userData';

const getUserProducts = async (id: string | undefined) => {
  if (!id) return null;
  const res = await fetch(`/api/user/${id}/products`, {
    method: 'GET',
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch products');
  }
  const data: UserData = await res.json();
  return data;
};

export default getUserProducts;
