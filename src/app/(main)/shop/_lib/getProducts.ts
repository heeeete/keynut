const getProducts = async (queryString: string, pageParam: unknown) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    let url = `${baseUrl}/api/products`;

    if (queryString) {
      url += `?${queryString}`;
    }

    url += `${queryString ? '&' : '?'}lastPage=${pageParam === undefined ? 1 : pageParam}`;

    const res = await fetch(url, {
      next: { tags: ['products'] },
    });

    if (!res.ok) {
      console.error('API 요청 실패:', res.status, res.statusText);
      throw new Error('Failed to fetch products');
    }
    const data = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error('getProducts 함수 실행 중 에러 발생:', error);
    throw error;
  }
};

export default getProducts;
