import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const VALID_USERS: Record<string, any> = {
      "ian": {"password":"ian","display":"Ian","role":"member","emoji":"👤"},
      "dody": {"password":"dody","display":"Dody","role":"member","emoji":"👤"},
      "ceo": {"password":"ceocerdasliving","display":"CEO","role":"admin","emoji":"🛡️"},
      "admin": {"password":"admincerdas","display":"Admin","role":"admin","emoji":"⚡"},
      "pembangunancerdasliving": {"password":"ceocerdasliving","display":"Developer","role":"admin","emoji":"🏗️"}
    };
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
