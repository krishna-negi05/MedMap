import { NextResponse } from 'next/server';
import { createUser, generateJWT } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    const user = await createUser({ email, password, name });
    const token = generateJWT(user);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set('app_session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 400 });
  }
}
