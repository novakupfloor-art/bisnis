import { NextResponse } from 'next/server';
// Supabase removed – no DB logging

export const dynamic = 'force-dynamic';

/**
 * Helper to extract client IP address from the request.
 */
function getClientIp(request: Request): string {
  // Next.js runs on Vercel/Node where the IP may be in these headers.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain a list of IPs, the first is the client.
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  // Fallback to remote address if available (Node.js environment).
  // @ts-ignore – request.socket may not exist in the type definition.
  const socket = (request as any).socket;
  if (socket && socket.remoteAddress) return socket.remoteAddress;
  return 'unknown';
}

/**
 * POST /api/auth/login
 * Expected body: { email: string, password: string }
 * This example does NOT perform real authentication – replace with your auth logic.
 * It records the login attempt (including IP and user‑agent) in Supabase.
 */
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const timestamp = new Date().toISOString();

  // ---- BEGIN placeholder authentication ----
  // In a real app you would verify the credentials against your user DB.
  const isValid = email && password && email.includes('@'); // simplistic check
  // ---- END placeholder authentication ----

// Supabase logging removed – no DB operation

  if (isValid) {
    // Set a simple session token in a cookie (for demo purposes).
    // Generate a simple session token (in production use JWT)
    const sessionToken = crypto.randomUUID();
    const response = NextResponse.json({ success: true, message: 'Login successful' });
    // Set secure, httpOnly cookie
    response.cookies.set('cl_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
}
