import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const FRONTEND_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function GET() {
  try {
    // Fetch the OAuth URL from backend
    const res = await fetch(`${BACKEND_URL}/api/auth/google/url`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[OAUTH] Failed to get Google URL:", res.status, await res.text());
      return NextResponse.redirect(new URL("/login?error=oauth_failed", FRONTEND_URL));
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
  } catch (error) {
    console.error("[OAUTH] Google auth error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", FRONTEND_URL));
  }
}
