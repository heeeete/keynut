export default async function getUsers(page, pageSize) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(`/api/user?offset=${offset}&limit=${pageSize}`);
  const data = await response.json();
  return data;
}
