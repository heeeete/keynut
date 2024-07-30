export default async function getUsers(page, nickname, keyword, price, pageSize) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(
    `/api/admin/products?offset=${offset}&keyword=${keyword}&nickname=${nickname}&price=${price}&limit=${pageSize}`,
    {
      cache: 'no-store',
    },
  );
  const data = await response.json();
  return data;
}
