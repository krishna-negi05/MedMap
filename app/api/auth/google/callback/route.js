import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const intent = searchParams.get("state"); // <--- 1. Get the intent back from Google

    if (!code) return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));

    // Exchange code for tokens (Standard stuff)
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.id_token) return NextResponse.redirect(new URL("/login?error=token_failed", req.url));

    const userInfo = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64").toString()
    );

    // Check user
    let user = await prisma.user.findUnique({ where: { email: userInfo.email } });
    let isNewUser = false;

    // === THE NEW LOGIC STARTS HERE ===
    
    // Scenario 1: User clicked "Login" but has no account -> Block
    if (!user && intent === 'login') {
      return NextResponse.redirect(new URL("/login?error=account_not_found", req.url));
    }

    // Scenario 2: User clicked "Sign Up" but ALREADY has an account -> Block
    if (user && intent === 'signup') {
       // Redirect to register page so they see "You already have an account"
      return NextResponse.redirect(new URL("/register?error=account_exists", req.url));
    }

    // Scenario 3: Create new user (Only if user doesn't exist)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
          role: "user",
        },
      });
      isNewUser = true;
    }

    // ... (Issue JWT and Cookie as before) ...
    const jwtToken = jwt.sign(
      { sub: user.id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect Logic
    const redirectPath = isNewUser ? "/onboard" : "/mindmap";
    const res = NextResponse.redirect(new URL(redirectPath, req.url));

    res.cookies.set("app_session", jwtToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}