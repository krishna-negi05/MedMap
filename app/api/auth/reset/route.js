import { NextResponse } from 'next/server';
import { consumeResetToken, generateJWT } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) return NextResponse.json({ error: 'Token and password required' }, { status: 400 });

    const user = await consumeResetToken(token, newPassword);
    if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

    const jwtToken = generateJWT(user);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set('app_session', jwtToken, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
