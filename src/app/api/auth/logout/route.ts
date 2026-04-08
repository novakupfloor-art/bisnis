import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export async function POST(request: Request) {
  // Create response indicating logout success
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  // Clear the session cookie by setting it with empty value and immediate expiration
  response.cookies.set('cl_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  });
  return response;
}
