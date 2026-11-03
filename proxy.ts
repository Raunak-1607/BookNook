import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  // Better-Auth stores session in either of these cookies depending on HTTP/HTTPS
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    const loginUrl = new URL('/Auth/Login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protected private routes
export const config = {
  matcher: [
    '/Add-Books/:path*',
    '/My-Books/:path*',
    '/My-Borrows/:path*',
    '/my-books/:path*',
    '/my-borrows/:path*',
  ],
};
