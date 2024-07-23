export default async function getProductWithUser(productId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
    next: { tags: [productId] },
  });
  if (!res.ok) return null;
  return await res.json();
}
