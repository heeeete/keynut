export default async function getProducts(keyword, pageParam, calculate) {
  try {
    console.log(keyword, pageParam, calculate);
    let url = `/api/price`;
    url += `?keyword=${keyword}`;
    if (pageParam) url += `&lastId=${pageParam}`;
    url += `&calculate=${calculate}`;

    const res = await fetch(url);

    const data = await res.json();
    if (!res.ok) {
      console.error('API 요청 실패:', res.status, res.statusText);
      throw new Error(data);
    }
    return data;
  } catch (error) {
    console.error('*************(Price Get Product Error : )', error);
  }
}
