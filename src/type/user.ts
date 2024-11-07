export interface User {
  _id: string;
  name: null | string;
  email: string;
  image: null | string;
  emailVerified: null;
  nickname: string;
  createdAt: Date;
  lastRaiseReset: Date;
  raiseCount: number;
  state: number;
  openChatUrl?: string;
  products?: string[];
  memo?: { [key: string]: string };
  nicknameChangedAt?: Date;
  bookmarked?: string[];
}
