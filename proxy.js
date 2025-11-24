import { NextResponse } from 'next/server';

// In Next.js 16+, the function is exported as 'proxy'
export function proxy(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('app_session')?.value;

  // --- DEBUG LOGS (Uncomment to verify it runs) ---
  if (!path.startsWith('/_next') && !path.startsWith('/static')) {
    // console.log(`[Proxy] Checking path: ${path}`);
  }
  // ------------------------------------------------

  // 1. Define Public Paths (No Login Required)
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/register' || 
    path === '/onboard' || // Allow onboard so new users aren't kicked out
    path.startsWith('/api/auth'); // Crucial for OAuth callbacks

  // 2. Guest trying to access Protected Page (like /mindmap, /cases)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Logged-in User trying to access Login/Register
  // (Send them to Home)
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - avatars (your public avatar images)
     */
    '/((?!_next/static|_next/image|favicon.ico|avatars|images|icons).*)',
  ],
};