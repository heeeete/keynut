import getProducts from '../_lib/getProducts';
import { useQuery } from '@tanstack/react-query';

const useProducts = (page = 1, nickname = '', keyword = '', price = '', PAGE_SIZE) => {
  return useQuery({
    queryKey: ['products', page, nickname, keyword, price],
    queryFn: () => getProducts(page, nickname, keyword, price, PAGE_SIZE),
    enabled: page !== undefined,
  });
};

export default useProducts;
