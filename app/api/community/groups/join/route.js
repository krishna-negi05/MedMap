import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { groupId } = await req.json();

    // Check if already member
    const existing = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.sub,
          groupId
        }
      }
    });

    if (existing) {
        // Optional: Could implement 'leave' logic here if toggling
        return NextResponse.json({ ok: true, status: 'already_member' });
    }

    await prisma.groupMember.create({
      data: {
        userId: user.sub,
        groupId
      }
    });

    return NextResponse.json({ ok: true, status: 'joined' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join' }, { status: 500 });
  }
}