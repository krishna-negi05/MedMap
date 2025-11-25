import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// POST: Toggle Vote
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { type, id, value } = await req.json(); // type: 'question' or 'answer', value: 1 or -1
    
    if (!['question', 'answer'].includes(type)) throw new Error('Invalid type');

    // Check existing vote
    const whereClause = type === 'question' 
      ? { userId_questionId: { userId: user.sub, questionId: id } }
      : { userId_answerId: { userId: user.sub, answerId: id } };

    const existingVote = await prisma.vote.findUnique({ where: whereClause });

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle off (remove vote)
        await prisma.vote.delete({ where: { id: existingVote.id } });
        return NextResponse.json({ ok: true, status: 'removed' });
      } else {
        // Change vote (e.g. from +1 to -1)
        await prisma.vote.update({ where: { id: existingVote.id }, data: { value } });
        return NextResponse.json({ ok: true, status: 'updated' });
      }
    } else {
      // Create new vote
      const data = { value, userId: user.sub };
      if (type === 'question') data.questionId = id;
      else data.answerId = id;

      await prisma.vote.create({ data });
      return NextResponse.json({ ok: true, status: 'created' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Vote failed' }, { status: 500 });
  }
}