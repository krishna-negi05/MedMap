import { NextResponse } from "next/server";

export async function GET() {
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI;

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=email%20profile&prompt=select_account`;

  return NextResponse.redirect(url);
}
