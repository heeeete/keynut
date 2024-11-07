export interface User {
  bookmarked?: string[]; // 없거나 ObjectId 배열
  createdAt: Date;
  email: string;
  emailVerified: null;
  id: string;
  image: null | string; // null or string
  lastRaiseReset: Date; //
  memo?: { [key: string]: string }; // 없거나 key:objectId value:string
  name: null | string; //null or string
  nickname: string;
  nicknameChangedAt?: Date; //없거나 타임형식
  openChatUrl?: string; //없거나 string
  provider: string;
  raiseCount: number;
  state: number;
  products?: string[]; // 없거나 ObjectId 배열
}
