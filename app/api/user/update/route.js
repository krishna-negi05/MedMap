import { NextResponse } from 'next/server';
import { verifyJWT } from '../../../../lib/auth';
import { updateUser } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const cookie = req.cookies.get('app_session')?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyJWT(cookie);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const updated = await updateUser(payload.sub, body);
    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
