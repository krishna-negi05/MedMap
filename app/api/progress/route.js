import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// 1. GET: Fetch the user's saved progress
export async function GET(request) {
  // In a real app, get userId from session. For now, we use a demo ID.
  const userId = "demo-user-123"; 

  try {
    const progress = await prisma.topicProgress.findMany({
      where: { userId, isCompleted: true },
    });

    // Convert array of objects to a simple map: { "Topic Name": true }
    const progressMap = {};
    progress.forEach((p) => {
      progressMap[p.topicId] = true;
    });

    return NextResponse.json(progressMap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// 2. POST: Save a topic as checked/unchecked
export async function POST(request) {
  const userId = "demo-user-123";
  const { topicId, isCompleted } = await request.json();

  try {
    // Check if user exists, if not create them (Simple "Upsert" logic for demo)
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        // We have to create a dummy email for the schema constraint
        user = await prisma.user.create({ 
            data: { id: userId, email: 'demo@medmap.com' } 
        });
    }

    // Update or Create the progress record
    const record = await prisma.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId: userId,
          topicId: topicId,
        },
      },
      update: { isCompleted: isCompleted },
      create: {
        userId: userId,
        topicId: topicId,
        isCompleted: isCompleted,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}