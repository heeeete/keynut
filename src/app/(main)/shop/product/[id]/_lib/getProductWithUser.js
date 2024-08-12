export default async function getProductWithUser(productId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
    next: { tags: [productId] },
  });
  if (res.status === 404) {
    throw new Error('Not Found'); // 404 상태일 때 에러를 발생시킵니다.
  }

  if (!res.ok) {
    throw new Error('Failed to fetch'); // 기타 에러 발생 시
  }
  return await res.json();
}
