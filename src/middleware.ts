// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('cl_session')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/api/auth/login'];

  // If request is for a public path, allow
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If no session cookie, redirect to login page
  if (!sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

// Apply middleware to all routes except static assets and API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
