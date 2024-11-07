import { User } from '@/type/user';

interface ExtendsUser extends User {
  provider: string;
  providerAccountId: string;
  state: number;
}

interface Data {
  users: Partial<ExtendsUser>[];
  total: number;
}

export default async function getUsers(page: number, keyword: string, pageSize: number) {
  const offset = (page - 1) * pageSize;
  const response = await fetch(`/api/admin/users?offset=${offset}&keyword=${keyword}&limit=${pageSize}`, {
    cache: 'no-cache',
  });
  const data: Data = await response.json();
  return data;
}
