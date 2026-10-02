import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET() {
  // Fetch the OAuth URL from backend
  const res = await fetch(`${BACKEND_URL}/api/auth/facebook/url`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
  }

  const { url, codeVerifier } = await res.json();

  // Create response with redirect
  const response = NextResponse.redirect(url);

  // Set the code verifier cookie on the frontend domain
  response.cookies.set("oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  return response;
}
