// import getUserSession from '@/app/utils/getUserSession';
// import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const s = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const jwt = await getToken({ req, s });
  console.log('JWT =========== ', jwt);

  if (!jwt) return NextResponse.redirect(new URL('/signin', req.url));
  else return NextResponse.next();
}

// // 전체 경로에 대해 미들웨어를 적용
export const config = {
  matcher: '/sell',
};
