import ProductData from '@keynut/type/productData';
import User from '@keynut/type/user';

export interface UserData {
  provider: 'kakao' | 'naver';
  userProducts: ProductData[];
  userProfile: User;
}
