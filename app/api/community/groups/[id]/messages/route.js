import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { verifyJWT } from '../../../../../../lib/auth';

// GET: Fetch messages for a group
export async function GET(req, { params }) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Force resolution of params for Next.js 15+ compliance
    const resolvedParams = await Promise.resolve(params);
    const groupId = resolvedParams.id;

    // 1. Verify Membership
    const membership = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId: user.sub, groupId } }
    });

    if (!membership) {
        return NextResponse.json({ error: 'Not a member' }, { status: 403 });
    }

    // 2. Fetch Messages
    const messages = await prisma.message.findMany({
      where: { groupId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        reactions: {
            include: { user: { select: { id: true, name: true } } }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100 
    });
    
    // 3. Process Reactions (Group by emoji)
    const processedMessages = messages.map(msg => {
        const reactionCounts = {};
        msg.reactions.forEach(r => {
            if (!reactionCounts[r.emoji]) {
                reactionCounts[r.emoji] = { count: 0, users: [], hasReacted: false };
            }
            reactionCounts[r.emoji].count++;
            reactionCounts[r.emoji].users.push(r.user.name);
            if (r.userId === user.sub) {
                reactionCounts[r.emoji].hasReacted = true;
            }
        });
        return { ...msg, reactionCounts };
    });

    return NextResponse.json({ ok: true, data: processedMessages });
  } catch (error) {
    console.error("Message Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Send a message
export async function POST(req, { params }) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resolvedParams = await Promise.resolve(params);
    const groupId = resolvedParams.id;
    const { content, attachmentUrl, attachmentType } = await req.json();

    if (!content && !attachmentUrl) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

    const message = await prisma.message.create({
      data: {
        content,
        attachmentUrl,
        attachmentType,
        groupId,
        senderId: user.sub
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        reactions: true // Include empty reactions array for consistency
      }
    });
    
    // Return with empty reactionCounts structure to match GET format
    return NextResponse.json({ ok: true, data: { ...message, reactionCounts: {} } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}