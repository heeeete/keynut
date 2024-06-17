export default async function getProductWithUser(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`);
  if (!res.ok) return null;
  return await res.json();
}
