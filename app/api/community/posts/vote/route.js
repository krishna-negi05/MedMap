import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { postId, optionId } = await req.json();

    // 1. Find if user already voted on THIS post (any option)
    // Since PollVote links to PollOption, we need to find votes where option.postId == postId
    const existingVote = await prisma.pollVote.findFirst({
      where: {
        userId: user.sub,
        option: { postId: postId }
      }
    });

    if (existingVote) {
      // If clicking same option, ignore (or toggle off if you prefer)
      if (existingVote.optionId === optionId) {
         return NextResponse.json({ ok: true });
      }
      // Delete old vote to switch
      await prisma.pollVote.delete({ where: { id: existingVote.id } });
    }

    // 2. Create new vote
    await prisma.pollVote.create({
      data: {
        userId: user.sub,
        optionId: optionId
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: 'Vote failed' }, { status: 500 });
  }
}