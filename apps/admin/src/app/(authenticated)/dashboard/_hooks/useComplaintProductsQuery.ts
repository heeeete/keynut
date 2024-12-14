import { KakaoAccounts, NaverAccounts } from '@keynut/type/accounts';
import User from '@keynut/type/user';
import ProductData from '@keynut/type/productData';
import { useQuery } from '@tanstack/react-query';

interface Data extends ProductData {
  userAccount: NaverAccounts | KakaoAccounts;
  userInfo: Partial<User>;
}

const useComplaintProductsQuery = (page = 1, PAGE_SIZE: number) => {
  return useQuery<{ products: Data[] | [] }>({
    queryKey: ['complaint-products', page],
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;
      const res = await fetch(`/api/products/complaint?offset=${offset}&&limit=${PAGE_SIZE}`);
      const data = await res.json();
      return data;
    },
    enabled: page !== undefined,
  });
};

export default useComplaintProductsQuery;
