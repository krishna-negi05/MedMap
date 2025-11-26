import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// GET: Fetch all groups (or search)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;

  try {
    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        _count: { select: { members: true } },
        members: user ? { where: { userId: user.sub } } : false // Check if current user is a member
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add isMember field for frontend convenience
    const data = groups.map(g => ({
      ...g,
      memberCount: g._count.members,
      isMember: user && g.members.length > 0
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

// POST: Create a new group
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, description, avatar } = await req.json();

    if (!name) return NextResponse.json({ error: 'Group name required' }, { status: 400 });

    // Create group AND add creator as the first member (admin)
    const group = await prisma.group.create({
      data: {
        name,
        description,
        avatar,
        adminId: user.sub,
        members: {
          create: { userId: user.sub }
        }
      }
    });

    return NextResponse.json({ ok: true, data: group });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}