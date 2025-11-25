import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// 1. GET: Fetch the logged-in user's progress
export async function GET(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Find all completed topics for this user
    const progress = await prisma.topicProgress.findMany({
      where: { userId: user.sub, isCompleted: true },
      select: { topicId: true } // We only need the IDs
    });
    
    // Convert array to an object for easy lookup: { "Topic Name": true, ... }
    const progressMap = progress.reduce((acc, curr) => {
      acc[curr.topicId] = true;
      return acc;
    }, {});

    return NextResponse.json({ ok: true, data: progressMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// 2. POST: Toggle a topic checkbox
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topicId, isCompleted } = await req.json();

    // Upsert: Create if doesn't exist, Update if it does
    await prisma.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId: user.sub,
          topicId: topicId
        }
      },
      update: { isCompleted },
      create: {
        userId: user.sub,
        topicId,
        isCompleted
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}