const getProducts = async (queryString, pageParam) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    let url = `${baseUrl}/api/products`;

    if (queryString) {
      url += `?${queryString}`;
    }

    if (pageParam && pageParam.lastId && pageParam.lastCreatedAt) {
      url += `${queryString ? '&' : '?'}lastId=${pageParam.lastId}&lastCreatedAt=${pageParam.lastCreatedAt}`;
    }
    const res = await fetch(url, {
      next: { tags: ['products'] },
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
