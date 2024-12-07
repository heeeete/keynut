export default interface User {
  id?: string;
  _id?: string;
  name: null | string;
  email: string;
  image: null | string;
  emailVerified: null;
  nickname: string;
  createdAt: string;
  lastRaiseReset: string;
  raiseCount: number;
  state: number;
  openChatUrl?: string;
  products?: string[];
  memo?: { [key: string]: string };
  nicknameChangedAt?: string;
  bookmarked?: string[] | [];
  provider?: 'kakao' | 'naver';
}
