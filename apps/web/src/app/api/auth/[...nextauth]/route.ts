// @ts-nocheck

import NextAuth from 'next-auth';
import { authOptions } from '@/app/(main)/_lib/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
