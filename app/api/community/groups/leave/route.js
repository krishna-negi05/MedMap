import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { groupId } = await req.json();

    // Check if user is the admin (optional: prevent admin from leaving without transferring ownership)
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { adminId: true }
    });

    // Delete membership
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: user.sub,
          groupId
        }
      }
    });

    return NextResponse.json({ ok: true, status: 'left' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 });
  }
}