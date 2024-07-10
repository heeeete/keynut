export default async function getUsers(page, keyword, pageSize) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(`/api/admin/users?offset=${offset}&keyword=${keyword}&limit=${pageSize}`, {
    cache: 'no-cache',
  });
  const data = await response.json();
  return data;
}
