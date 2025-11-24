import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true, message: 'Logged out successfully' });

    res.cookies.set('app_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,           // IMPORTANT
      expires: new Date(0) // also clear for older browsers
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
