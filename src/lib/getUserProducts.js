const getUserProducts = async id => {
  const res = await fetch(`/api/user/${id}/products`, {
    method: 'GET',
  });
  if (!res.ok) {
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch products');
  }
  const data = await res.json();
  return data;
};

export default getUserProducts;
