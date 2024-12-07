const getProducts = async (queryString: string, pageParam: unknown) => {
  try {
    console.log('queryString = ', queryString);
    console.log('pageParam = ', pageParam);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    let url = `${baseUrl}/api/products`;
    console.log(url);

    if (queryString && queryString.length) {
      url += `?${queryString}`;
    }

    url += `${queryString && queryString.length ? '&' : '?'}lastPage=${pageParam === undefined ? 1 : pageParam}`;

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
