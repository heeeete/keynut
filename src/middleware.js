import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const s = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const session = await getToken({ req, s });

  const { pathname } = req.nextUrl;

  // Check if the user is trying to access the admin path
  if (pathname.startsWith('/admin')) {
    // If there is no session or the user is not an admin, redirect to the sign-in page
    if (!session || !session.admin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // For other paths, just check if the user is authenticated
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  // If everything is fine, proceed to the next middleware or the requested page
  return NextResponse.next();
}

// Apply the middleware to specified paths
export const config = {
  matcher: ['/sell', '/post', '/bookmark', '/mypage/:path*', '/admin/:path*'],
};
