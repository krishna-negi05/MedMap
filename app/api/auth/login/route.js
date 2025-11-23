import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, name, mode } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Find user
    let user = await prisma.user.findUnique({ where: { email } });

    // 2. Handle Sign Up (User should NOT exist)
    if (mode === 'signup') {
        if (user) {
            return NextResponse.json({ error: 'Account already exists. Please Login.' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
            },
        });
    } 
    // 3. Handle Login (User MUST exist)
    else {
        if (!user) {
            return NextResponse.json({ error: 'Account not found. Please Sign Up.' }, { status: 404 });
        }
        // Check password (if account has one)
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
        } else {
            // Legacy or Guest account trying to add password logic later (optional handling)
            // For now, simply update with new password for seamless migration
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword }});
        }
    }

    // 4. Create Persistent Session
    cookies().set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 Days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}