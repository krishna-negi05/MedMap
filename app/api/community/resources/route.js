import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

// ... (Keep GET, POST, DELETE exactly as they were) ...

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode'); 
  const year = searchParams.get('year');
  const subject = searchParams.get('subject');
  const search = searchParams.get('search'); 

  try {
    if (mode === 'top') {
      const topResources = await prisma.resource.findMany({
        orderBy: { downloads: 'desc' },
        take: 15,
        include: { user: { select: { name: true, avatar: true, year: true } } }
      });
      return NextResponse.json({ ok: true, data: topResources });
    }

    const where = {};
    if (year && year !== 'All') where.year = parseInt(year);
    if (subject && subject !== 'All') where.subject = subject;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: { user: { select: { name: true, avatar: true, year: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ ok: true, data: resources });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = req.cookies.get('app_session')?.value;
  const userPayload = token ? verifyJWT(token) : null;
  if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description,
        subject: body.subject,
        year: parseInt(body.year),
        fileUrl: body.fileUrl,
        fileType: body.fileType,
        userId: userPayload.sub
      }
    });
    return NextResponse.json({ ok: true, data: resource });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save resource' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const token = req.cookies.get('app_session')?.value;
  const userPayload = token ? verifyJWT(token) : null;
  if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    if (resource.userId !== userPayload.sub) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// 👇 UPDATED: Smart PATCH
export async function PATCH(req) {
  const token = req.cookies.get('app_session')?.value;
  const userPayload = token ? verifyJWT(token) : null;
  
  // If not logged in, we can't track unique downloads, so we might just block or allow without counting unique
  // Ideally, force login for counting. Here we assume logged in.
  if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // 1. Check if user already downloaded this resource
    const existing = await prisma.download.findUnique({
      where: {
        userId_resourceId: {
          userId: userPayload.sub,
          resourceId: id
        }
      }
    });

    // 2. If already downloaded, return success but signal NO increment
    if (existing) {
        return NextResponse.json({ ok: true, incremented: false });
    }

    // 3. If new, record download AND increment count
    // Transaction ensures both happen or neither
    const result = await prisma.$transaction([
        prisma.download.create({
            data: { userId: userPayload.sub, resourceId: id }
        }),
        prisma.resource.update({
            where: { id },
            data: { downloads: { increment: 1 } }
        })
    ]);

    return NextResponse.json({ ok: true, incremented: true, data: result[1] });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}