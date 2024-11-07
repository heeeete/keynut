import { KakaoAccounts, NaverAccounts } from '@/type/accounts';
import { ProductData } from '@/type/productData';
import { useQuery } from '@tanstack/react-query';

interface Data extends ProductData {
  userAccount: NaverAccounts | KakaoAccounts;
}

const useComplaintProductsQuery = (page = 1, PAGE_SIZE: number) => {
  return useQuery({
    queryKey: ['complaint-products', page],
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;
      const res = await fetch(`/api/admin/products/complaint?offset=${offset}&&limit=${PAGE_SIZE}`);
      const data: { products: Data[] | [] } = await res.json();
      console.log(data);
      return data;
    },
    enabled: page !== undefined,
  });
};

export default useComplaintProductsQuery;
