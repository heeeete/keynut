import { ProductData } from './productData';
import { User } from './user';

export interface UserData {
  provider: 'kakao' | 'google';
  userProducts: ProductData[];
  userProfile: User;
}
