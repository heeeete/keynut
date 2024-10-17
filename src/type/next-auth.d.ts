import { DefaultSession } from 'next-auth';
import { ObjectId } from 'mongodb';

interface User {
  bookmarked?: ObjectId[]; // 없거나 ObjectId 배열
  createdAt: Date;
  email: string;
  emailVerified: null;
  id: ObjectId;
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
  products?: ObjectId[]; // 없거나 ObjectId 배열
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
    expires: string;
  }
}
