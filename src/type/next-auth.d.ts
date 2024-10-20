import { DefaultSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { User } from './user';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
    expires: string;
  }
}
