export default async function getProductWithUser(productId) {
  if (productId?.length !== 24) {
    console.error('고유 ID의 값이 24글자가 아닙니다.');
    return null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
    next: { tags: [productId] },
  });

  if (res.status === 404) {
    console.error('상품을 찾을 수 없습니다.');
    return null;
  }
  if (!res.ok) {
    console.error('상품을 가져오는데 실패');
    return null;
  }

  return await res.json();
}
