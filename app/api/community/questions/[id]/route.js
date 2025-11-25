import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// GET: Fetch single question details
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, year: true } },
        votes: true,
        answers: {
          include: {
            user: { select: { id: true, name: true, avatar: true, year: true } },
            votes: true
          },
          orderBy: { createdAt: 'asc' } 
        }
      }
    });

    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Calculate Question Score
    const qScore = question.votes.reduce((acc, v) => acc + v.value, 0);

    // Process Answers (calc score)
    const processedAnswers = question.answers.map(a => ({
      ...a,
      score: a.votes.reduce((acc, v) => acc + v.value, 0),
      votes: undefined
    }));

    // Sort answers: Accepted first, then by score desc
    processedAnswers.sort((a, b) => {
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      return b.score - a.score;
    });

    return NextResponse.json({ 
      ok: true, 
      data: { ...question, score: qScore, answers: processedAnswers, votes: undefined } 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}