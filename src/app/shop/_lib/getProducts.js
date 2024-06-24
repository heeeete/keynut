const getProducts = async queryString => {
  // console.log(queryString);
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = queryString ? `${baseUrl}/api/products?${queryString}` : `${baseUrl}/api/products`;
    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('API 요청 실패:', res.status, res.statusText);
      throw new Error('Failed to fetch products');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('getProducts 함수 실행 중 에러 발생:', error);
    throw error;
  }
};

export default getProducts;
