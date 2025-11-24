import { NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  // Capture whether the user clicked "Login" or "Sign Up"
  const intent = searchParams.get("intent") || "signup"; 

  // 1. Generate PKCE Code Verifier & Challenge (Required for Twitter OAuth 2.0)
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // 2. Build the Twitter Authorization URL
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    response_type: "code",
    client_id: process.env.TWITTER_CLIENT_ID,
    redirect_uri: process.env.TWITTER_REDIRECT_URI,
    // Scopes: 'users.read' gives profile info, 'tweet.read' is often required by default
    // 'offline.access' gives a refresh token (optional but good practice)
    scope: "users.read tweet.read offline.access", 
    state: intent, // Pass 'login' or 'signup' to Twitter to send back later
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  };

  const url = `${rootUrl}?${new URLSearchParams(options).toString()}`;

  // 3. Redirect user to Twitter & save 'code_verifier' in a cookie for the callback
  const res = NextResponse.redirect(url);
  
  res.cookies.set("twitter_code_verifier", codeVerifier, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10 // 10 minutes
  });

  return res;
}