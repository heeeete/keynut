const fetchHotProducts = async category => {
  const url = category
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/hot?category=${category}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/hot`;
  const res = await fetch(url, {
    next: {
      revalidate: 5 * 60,
    },
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default fetchHotProducts;
