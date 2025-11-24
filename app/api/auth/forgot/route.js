import { NextResponse } from 'next/server';
import { createResetTokenFor } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const info = await createResetTokenFor(email);
    // don't reveal whether email exists
    if (!info) {
      return NextResponse.json({ ok: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // Dev: return token; in prod send email instead
    return NextResponse.json({ ok: true, message: 'Reset token created (dev: token returned).', token: info.token, expiresAt: info.expiry });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
