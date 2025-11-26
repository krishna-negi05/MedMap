import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// GET: Fetch Social Feed
export async function GET(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  const currentUserId = user?.sub;

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true, year: true } },
        likes: true, 
        _count: { select: { comments: true } },
        pollOptions: {
          include: { votes: true }
        }
      },
      take: 50 // Limit for now
    });

    // Transform data for frontend
    const data = posts.map(post => {
      const isLiked = currentUserId ? post.likes.some(l => l.userId === currentUserId) : false;
      
      // Process Poll Data if it exists
      let processedPoll = [];
      let userVotedOptionId = null;
      
      if (post.type === 'poll') {
        processedPoll = post.pollOptions.map(opt => {
          const isVoted = currentUserId ? opt.votes.some(v => v.userId === currentUserId) : false;
          if (isVoted) userVotedOptionId = opt.id;
          return {
            id: opt.id,
            text: opt.text,
            count: opt.votes.length,
            percentage: 0 // Will calculate in frontend or here
          };
        });

        const totalVotes = processedPoll.reduce((acc, curr) => acc + curr.count, 0);
        processedPoll = processedPoll.map(opt => ({
            ...opt,
            percentage: totalVotes === 0 ? 0 : Math.round((opt.count / totalVotes) * 100)
        }));
      }

      return {
        ...post,
        likesCount: post.likes.length,
        isLiked,
        commentsCount: post._count.comments,
        pollOptions: processedPoll,
        userVotedOptionId,
        // Strip heavy arrays
        likes: undefined
      };
    });

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

// POST: Create New Post
export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const user = token ? verifyJWT(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { content, type, imageUrl, pollOptions } = await req.json();

    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    const postData = {
      content,
      type: type || 'text',
      imageUrl,
      userId: user.sub,
    };

    // If Poll, add options
    if (type === 'poll' && Array.isArray(pollOptions)) {
        postData.pollOptions = {
            create: pollOptions.map(text => ({ text }))
        };
    }

    const newPost = await prisma.post.create({
      data: postData,
      include: {
        user: { select: { name: true, avatar: true } }
      }
    });

    return NextResponse.json({ ok: true, data: newPost });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
  }
}