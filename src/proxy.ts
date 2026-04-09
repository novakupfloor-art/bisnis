import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('cl_session')?.value;
  const { pathname } = request.nextUrl;

  // Hanya route /bisnis/* yang perlu autentikasi (kecuali /bisnis/login)
  const isProtected =
    pathname.startsWith('/bisnis') && !pathname.startsWith('/bisnis/login');

  // Semua route selain /bisnis/* bebas diakses tanpa login
  if (!isProtected) {
    return NextResponse.next();
  }

  // Untuk route /bisnis/*, cek cookie session
  if (!sessionCookie) {
    const loginUrl = new URL('/bisnis/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
