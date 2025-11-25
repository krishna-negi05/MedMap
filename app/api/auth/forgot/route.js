// app/api/auth/forgot/route.js
import { NextResponse } from 'next/server';
import { createResetTokenFor } from '../../../../lib/auth';
import nodemailer from 'nodemailer'; 

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const tokenData = await createResetTokenFor(email); // Returns tokenData or null

    // 🛑 SECURITY FIX: Return success message regardless of tokenData presence.
    // This prevents malicious actors from checking which emails are registered.
    if (tokenData) { 
        // Only send the email if the token was successfully created (i.e., user exists)
        const transporter = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${tokenData.token}`;

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
                This link expires in 1 hour. Token code: <strong>${tokenData.token}</strong>
              </p>
            </div>
          `,
        });
    }
    
    // Always return a success response (status 200) to the frontend.
    return NextResponse.json({
      ok: true,
      message: 'If an account exists, a reset link has been sent.',
      // Only include the dev token if it exists (for local testing).
      ...(tokenData && { token: tokenData.token, expires: tokenData.expiry })
    });
    // The frontend will receive 'ok: true' whether the user exists or not.

  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}