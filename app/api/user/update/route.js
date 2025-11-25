// app/api/user/update/route.js
import { NextResponse } from 'next/server';
import { verifyJWT, updateUser } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const cookie = req.cookies.get('app_session')?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = verifyJWT(cookie);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Pass all fields to the library function
    const updatedUser = await updateUser(payload.sub, {
        name: body.name,
        avatar: body.avatar,
        year: body.year,
        theme: body.theme,
        mindmapDepth: body.mindmapDepth,
        contentDensity: body.contentDensity,
        defaultDifficulty: body.defaultDifficulty,
        autoProgress: body.autoProgress,
        roadmapReminders: body.roadmapReminders
    });
    
    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}