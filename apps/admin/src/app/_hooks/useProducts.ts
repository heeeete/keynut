import { ProductData } from '@keynut/type';
import adminGetProducts from '../_lib/adminGetProducts';
import { useQuery } from '@tanstack/react-query';

interface ExtendedProductData extends ProductData {
  nickname: string;
}

interface Data {
  products: ExtendedProductData[];
  total: number;
}

const useProducts = (page = 1, nickname = '', keyword = '', price = '', PAGE_SIZE: number) => {
  return useQuery<Data>({
    queryKey: ['products', page, nickname, keyword, price],
    queryFn: () => adminGetProducts(page, nickname, keyword, price, PAGE_SIZE),
    enabled: page !== undefined,
  });
};

export default useProducts;
