import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const s = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const session = await getToken({ req, s });
  if (!session) return NextResponse.redirect(new URL('/signin', req.url));
  else return NextResponse.next();
}

// // 전체 경로에 대해 미들웨어를 적용
export const config = {
  matcher: ['/sell', '/post', '/bookmark', '/mypage/:path*'],
};
