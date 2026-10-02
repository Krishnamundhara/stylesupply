import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/account', '/wishlist', '/cart', '/checkout'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing login/signup while authenticated
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/wishlist/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/login',
    '/signup',
  ],
};
