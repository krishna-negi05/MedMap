import { NextResponse } from 'next/server';

export function middleware(request) {
  const userId = request.cookies.get('userId')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected Routes: Redirect to /login if no cookie
  // We protect everything except public assets, login, and api routes
  const protectedPaths = ['/mindmap', '/cases', '/roadmap', '/skills', '/tools'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Login Page: Redirect to /mindmap if already logged in
  if (pathname === '/login' && userId) {
    return NextResponse.redirect(new URL('/mindmap', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};