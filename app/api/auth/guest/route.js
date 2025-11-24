import { NextResponse } from 'next/server';
import { createGuestUser, generateJWT } from '../../../../lib/auth';

export async function POST() {
  try {
    const guest = await createGuestUser();
    const token = generateJWT(guest, { role: 'guest' });
    const res = NextResponse.json({ ok: true, guest });
    res.cookies.set('app_session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 }); // 1 day
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Guest creation failed' }, { status: 500 });
  }
}
