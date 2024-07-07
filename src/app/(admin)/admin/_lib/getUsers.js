export default async function getUsers(page, keyword, pageSize) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(`/api/user?offset=${offset}&keyword=${keyword}&limit=${pageSize}`);
  const data = await response.json();
  return data;
}
