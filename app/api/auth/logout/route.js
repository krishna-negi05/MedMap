import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true, message: 'Logged out successfully' });

    // Clear the cookie by setting it to empty + expired
    res.cookies.set('app_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
