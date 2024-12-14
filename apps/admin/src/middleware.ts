import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function middleware(req: any) {
  const cookie: RequestCookie | undefined = req.cookies.get('auth');
  console.log('middleware : ', cookie);

  if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); // 비밀 키를 Uint8Array로 변환
      const jwtToken = await jwtVerify(cookie.value, secret);
      console.log(jwtToken);
      return NextResponse.next(); // 인증 성공
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.redirect(new URL('/', req.url));
}

// Apply the middleware to specified paths
export const config = {
  matcher: ['/dashboard/:path*'],
};
