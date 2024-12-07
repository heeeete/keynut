import { DefaultSession } from 'next-auth';
import User from '@keynut/type/user';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
    expires: string;
    admin: true | false;
  }
}
