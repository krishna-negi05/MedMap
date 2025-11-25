import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

export async function GET(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    const history = await prisma.toolHistory.findMany({
      where: { userId: user.sub, toolType: type },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ ok: true, data: history });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { toolType, title, data } = await req.json();
    const entry = await prisma.toolHistory.create({
      data: { toolType, title, data, userId: user.sub }
    });
    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await prisma.toolHistory.delete({ where: { id, userId: user.sub } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}