import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { postId } = await req.json();

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: { userId: user.sub, postId }
      }
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ ok: true, liked: false });
    } else {
      await prisma.like.create({
        data: { userId: user.sub, postId }
      });
      return NextResponse.json({ ok: true, liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}