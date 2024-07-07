import getUsers from '../_lib/getUsers';
import { useQuery } from '@tanstack/react-query';

const useUsers = (page = 1, keyword = '', PAGE_SIZE) => {
  return useQuery({
    queryKey: ['users', page, keyword],
    queryFn: () => getUsers(page, keyword, PAGE_SIZE),
    enabled: page !== undefined,
  });
};

export default useUsers;
