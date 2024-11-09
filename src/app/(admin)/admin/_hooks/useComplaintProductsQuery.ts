import { KakaoAccounts, NaverAccounts } from '@/type/accounts';
import { ProductData } from '@/type/productData';
import { User } from '@/type/user';
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
      const res = await fetch(`/api/admin/products/complaint?offset=${offset}&&limit=${PAGE_SIZE}`);
      const data = await res.json();
      console.log(data);
      return data;
    },
    enabled: page !== undefined,
  });
};

export default useComplaintProductsQuery;
