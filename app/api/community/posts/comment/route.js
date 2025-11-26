import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: { user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json({ ok: true, data: comments });
    } catch(e) {
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { postId, content } = await req.json();
    if (!content) return NextResponse.json({ error: 'Empty comment' }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: user.sub
      },
      include: { user: { select: { name: true, avatar: true } } }
    });

    return NextResponse.json({ ok: true, data: comment });
  } catch (error) {
    return NextResponse.json({ error: 'Comment failed' }, { status: 500 });
  }
}