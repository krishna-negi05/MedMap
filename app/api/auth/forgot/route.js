// app/api/auth/forgot/route.js
import { NextResponse } from 'next/server';
import { createResetTokenFor } from '../../../../lib/auth';
import nodemailer from 'nodemailer'; // 1. Import nodemailer

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

    // 2. Create a Transporter (Connection to your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'host' and 'port' for other providers
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 3. Construct the Reset Link
    // Assuming your app runs on localhost:3000 or a production domain
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${tokenData.token}`;

    // 4. Send the Email
    await transporter.sendMail({
      from: `"MedMap Support" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the link below to proceed:</p>
          <a href="${resetLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This link expires in 1 hour.<br/>
            Token code: <strong>${tokenData.token}</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: 'Reset email sent successfully.',
      // remove the token from response in production for security
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}