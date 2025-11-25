import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';

// GET: Fetch all saved mindmaps for the logged-in user
export async function GET(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const mindmaps = await prisma.mindmap.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        topic: true,
        createdAt: true,
        data: true
      }
    });
    return NextResponse.json({ ok: true, data: mindmaps });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mindmaps' }, { status: 500 });
  }
}

// POST: Save a new mindmap
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic, data } = await req.json();

    const newMindmap = await prisma.mindmap.create({
      data: {
        topic,
        data,
        userId: user.sub
      }
    });

    return NextResponse.json({ ok: true, mindmap: newMindmap });
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: 'Failed to save mindmap' }, { status: 500 });
  }
}

// DELETE: Remove a mindmap
export async function DELETE(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await prisma.mindmap.delete({
      where: { id, userId: user.sub } // Ensure user owns it
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}