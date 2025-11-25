import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// GET: Fetch all questions (with search)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }

  try {
    const questions = await prisma.question.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true, year: true } },
        _count: { select: { answers: true } },
        votes: true // Fetch votes to calculate score
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate scores
    const data = questions.map(q => ({
      ...q,
      score: q.votes.reduce((acc, v) => acc + v.value, 0),
      votes: undefined // hide raw votes
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST: Create a new question
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, content, tags } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        tags: tags || [],
        userId: user.sub
      }
    });
    return NextResponse.json({ ok: true, data: question });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post question' }, { status: 500 });
  }
}