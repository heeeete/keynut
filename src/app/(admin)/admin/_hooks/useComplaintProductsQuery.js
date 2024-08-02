import { useQuery } from '@tanstack/react-query';

const useComplaintProductsQuery = (page = 1, PAGE_SIZE) => {
  return useQuery({
    queryKey: ['complaint-products', page],
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;
      const res = await fetch(`/api/admin/products/complaint?offset=${offset}&&limit=${PAGE_SIZE}`);
      const data = await res.json();
      return data;
    },
    enabled: page !== undefined,
  });
};

export default useComplaintProductsQuery;
