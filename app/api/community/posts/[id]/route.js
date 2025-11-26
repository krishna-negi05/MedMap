import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function DELETE(req, { params }) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Explicitly await params
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (post.userId !== user.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}