import { ProductData } from './productData';
import { User } from './user';

export interface UserData {
  provider: 'kakao' | 'naver';
  userProducts: ProductData[];
  userProfile: User;
}
