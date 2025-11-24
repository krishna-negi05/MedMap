import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    
    const codeVerifier = req.cookies.get("twitter_code_verifier")?.value;

    if (!code || !codeVerifier) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    // 1. Exchange code for Access Token
    const basicAuth = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("Twitter Token Error:", tokens);
      return NextResponse.redirect(new URL("/login?error=token_failed", req.url));
    }

    // 2. Get User Info
    const userRes = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url", {
      headers: {
        "Authorization": `Bearer ${tokens.access_token}`,
      },
    });

    const userData = await userRes.json();
    const twitterUser = userData.data;

    if (!twitterUser) {
      return NextResponse.redirect(new URL("/login?error=user_fetch_failed", req.url));
    }

    // Construct data
    const email = twitterUser.email || `${twitterUser.username}@twitter.medmap.com`; 
    const name = twitterUser.name;
    
    // 3. Check/Create User (Smart Auth)
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          // IMPORTANT: Avatar is NOT here. It will be null in DB.
          role: "user",
        },
      });
      isNewUser = true;
    }

    // 4. Create Session
    const jwtToken = jwt.sign(
      { sub: user.id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Redirect Logic
    // If new, send to onboard. If existing, send home.
    const redirectPath = isNewUser ? "/onboard" : "/"; 
    const res = NextResponse.redirect(new URL(redirectPath, req.url));

    res.cookies.set("app_session", jwtToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.delete("twitter_code_verifier");

    return res;

  } catch (error) {
    console.error("Twitter Auth Error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}