// app/api/auth/forgot/route.js
import { NextResponse } from 'next/server';
import { createResetTokenFor } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const tokenData = await createResetTokenFor(email);

    if (!tokenData) {
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      );
    }

    // In production, send email here.
    // For dev, return token so you can test.
    return NextResponse.json({
      ok: true,
      message: 'Reset token generated.',
      token: tokenData.token,
      expires: tokenData.expiry
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
