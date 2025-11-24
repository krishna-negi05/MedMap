import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect("/login?error=oauth_failed");

  // Exchange code for tokens
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
  if (!tokens.id_token) return NextResponse.redirect("/login?error=token_failed");

  // Decode ID Token
  const userInfo = JSON.parse(
    Buffer.from(tokens.id_token.split(".")[1], "base64").toString()
  );

  const email = userInfo.email;
  const name = userInfo.name;
  const avatar = userInfo.picture;

  // check user
  let user = await prisma.user.findUnique({ where: { email } });

  // if new → create account (signup)
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatar,
        role: "user",
      },
    });
  }

  // issue session cookie
  const jwtToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const redirectTo = user.name ? "/mindmap" : "/onboard";
const res = NextResponse.redirect(redirectTo);
// <=== Your redirect after create account/login
  res.cookies.set("app_session", jwtToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
