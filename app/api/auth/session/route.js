import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const userId = cookies().get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}