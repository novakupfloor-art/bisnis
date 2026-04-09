import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('cl_session')?.value;
  const { pathname } = request.nextUrl;

  // SEMUA route dikunci (kecuali login)
  const isProtected = !pathname.startsWith('/bisnis/login');

  // Skip static files & api
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Jika dilindungi dan tidak ada cookie session, tendang ke login
  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/bisnis/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
