import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Create a unique guest ID
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guestEmail = `${guestId}@medmap.guest`;

    // Create the guest user in DB
    const user = await prisma.user.create({
      data: {
        email: guestEmail,
        name: 'Guest User',
        password: null, // No password for guests
      },
    });

    // Set session cookie (valid for 7 days)
    cookies().set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guest Login Error:", error);
    return NextResponse.json({ error: 'Guest login failed' }, { status: 500 });
  }
}