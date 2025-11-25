import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// POST: Accept an answer
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { answerId } = await req.json();
    
    const answer = await prisma.answer.findUnique({ 
      where: { id: answerId },
      include: { question: true }
    });

    if (!answer) return NextResponse.json({ error: 'Answer not found' }, { status: 404 });

    // Verify user owns the question
    if (answer.question.userId !== user.sub) {
      return NextResponse.json({ error: 'Only question author can accept' }, { status: 403 });
    }

    // Un-accept previous accepted answer for this question (if any)
    await prisma.answer.updateMany({
      where: { questionId: answer.questionId, isAccepted: true },
      data: { isAccepted: false }
    });

    // Accept new one
    const updated = await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true }
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to accept' }, { status: 500 });
  }
}