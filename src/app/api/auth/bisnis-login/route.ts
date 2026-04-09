import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const usersJson = process.env.CL_USERS_JSON;

    if (!usersJson) {
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const VALID_USERS = JSON.parse(usersJson);
    const key = username.trim().toLowerCase();
    const user = VALID_USERS[key];

    if (!user) {
      return NextResponse.json({ success: false, message: 'Username tidak dikenali' }, { status: 401 });
    }

    const expectedPassword = user.password || key;
    if (password.trim().toLowerCase() !== expectedPassword.toLowerCase()) {
      return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
    }

    // Success
    return NextResponse.json({
      success: true,
      user: {
        key: key,
        display: user.display,
        emoji: user.emoji,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
