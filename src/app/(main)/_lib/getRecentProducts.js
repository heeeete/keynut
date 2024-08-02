const getRecentProducts = async () => {
  console.log('GETRECENT!!!!!!!!!!!!!!!!!!!!!!!!!');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/recent`, {
    next: { tags: ['recentProducts'] },
  });
  if (!res.ok) {
    console.log('GETRECENT!!!!!!!!!!!!!!!!!!!!!!!!! null');
    return null;
  }
  const data = await res.json();
  console.log('GETRECENT!!!!!!!!!!!!!!!!!!!!!!!!! succecsscsc');
  return data;
};

export default getRecentProducts;
