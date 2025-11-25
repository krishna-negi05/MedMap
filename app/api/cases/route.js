import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Adjust path if needed
import { verifyJWT } from '../../../lib/auth'; // Adjust path if needed

// GET: Fetch saved cases
export async function GET(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const cases = await prisma.savedCase.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ ok: true, data: cases });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

// POST: Save a case
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, difficulty, data } = await req.json();
    const saved = await prisma.savedCase.create({
      data: {
        title,
        difficulty,
        data,
        userId: user.sub
      }
    });
    return NextResponse.json({ ok: true, case: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

// DELETE: Remove a case
export async function DELETE(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await prisma.savedCase.delete({ where: { id, userId: user.sub } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}