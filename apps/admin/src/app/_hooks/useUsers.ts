import User from '@keynut/type/user';
import getUsers from '../_lib/getUsers';
import { useQuery } from '@tanstack/react-query';

interface ExtendsUser extends User {
  providerAccountId: string;
  state: number;
}

interface Data {
  users: Partial<ExtendsUser>[];
  total: number;
}

const useUsers = (page = 1, keyword = '', PAGE_SIZE: number) => {
  return useQuery<Data>({
    queryKey: ['users', page, keyword],
    queryFn: () => getUsers(page, keyword, PAGE_SIZE),
    enabled: page !== undefined,
  });
};

export default useUsers;
