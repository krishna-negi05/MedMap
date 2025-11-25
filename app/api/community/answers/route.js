import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// POST: Submit an answer
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { content, questionId } = await req.json();
    
    if (!content || !questionId) {
        return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        userId: user.sub
      }
    });
    
    return NextResponse.json({ ok: true, data: answer });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to answer' }, { status: 500 });
  }
}