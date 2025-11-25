import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Adjust path to your prisma client
import { verifyJWT } from '../../../lib/auth'; // Adjust path to your auth lib

export async function POST(req) {
  try {
    // 1. Identify the user (if logged in)
    const token = req.cookies.get('app_session')?.value;
    const userPayload = token ? verifyJWT(token) : null;

    // 2. Parse the incoming data
    const body = await req.json();
    const { category, rating, message } = body;

    // 3. Validate
    if (!message || !rating) {
      return NextResponse.json({ error: 'Missing rating or message' }, { status: 400 });
    }

    // 4. Save to Database via Prisma
    const feedback = await prisma.feedback.create({
      data: {
        category,
        rating: parseInt(rating), // Ensure it's an integer
        message,
        userId: userPayload ? userPayload.sub : null, // Link to user if logged in
      },
    });

    return NextResponse.json({ ok: true, data: feedback });

  } catch (error) {
    console.error("Feedback Submission Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}