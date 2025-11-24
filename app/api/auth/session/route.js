import { NextResponse } from 'next/server';
import { verifyJWT, getUserById } from '../../../../lib/auth';

export async function GET(req) {
  try {
    const cookie = req.cookies.get('app_session')?.value;
    if (!cookie) return NextResponse.json({ ok: false, user: null });

    const payload = verifyJWT(cookie);
    if (!payload) return NextResponse.json({ ok: false, user: null });

    if (payload.role === 'guest') {
      return NextResponse.json({ ok: true, user: { id: payload.sub, name: payload.name, role: 'guest' } });
    }

    const user = await getUserById(payload.sub);
    if (!user) return NextResponse.json({ ok: false, user: null });
    return NextResponse.json({ ok: true, user: { ...user, role: 'user' } });
  } catch (err) {
    return NextResponse.json({ ok: false, user: null });
  }
}
