import { NextResponse } from 'next/server';
import { verifyJWT, updateUser } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const cookie = req.cookies.get('app_session')?.value;
    if (!cookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyJWT(cookie);
    if (!payload) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    const { name, avatar } = await req.json();

    if (!name || !avatar) {
      return NextResponse.json({ error: 'Name and avatar required' }, { status: 400 });
    }

    const user = await updateUser(payload.sub, { name, avatar });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
