// app/api/auth/session/route.js
import { NextResponse } from 'next/server';
import { verifyJWT, getUserById } from '../../../../lib/auth';

export async function GET(req) {
  try {
    // safe read of cookie value (App Router RequestCookies API)
    const cookie = req.cookies.get?.('app_session')?.value;
    if (!cookie) {
      // no session cookie
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    const payload = verifyJWT(cookie);
    if (!payload) {
      // invalid/expired token
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    // If you use guest sessions (role: 'guest') return minimal info
    if (payload.role === 'guest') {
      return NextResponse.json({
        ok: true,
        user: { id: payload.sub, name: payload.name || 'Guest', role: 'guest' }
      }, { status: 200 });
    }

    // persisted user expected — fetch from DB
    const user = await getUserById(payload.sub);
    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    // success: send sanitized user
    return NextResponse.json({ ok: true, user: { ...user, role: 'user' } }, { status: 200 });
  } catch (err) {
    // helpful server-side logging for debugging (remove/limit in production)
    /* eslint-disable no-console */
    console.error('Error in /api/auth/session:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ ok: false, user: null }, { status: 500 });
  }
}
