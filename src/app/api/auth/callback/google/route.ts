import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const FRONTEND_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

  if (!code || !codeVerifier) {
    console.error("[OAUTH] Missing code or verifier", { code: !!code, verifier: !!codeVerifier });
    return NextResponse.redirect(new URL("/login?error=oauth_failed", FRONTEND_URL));
  }

  try {
    // Exchange code with backend
    const res = await fetch(`${BACKEND_URL}/api/auth/callback/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, codeVerifier }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("[OAUTH] Backend exchange failed:", error);
      return NextResponse.redirect(new URL("/login?error=oauth_failed", FRONTEND_URL));
    }

    const { accessToken, refreshToken, needsOnboarding } = await res.json();

    // Redirect based on onboarding status
    const redirectUrl = needsOnboarding
      ? new URL("/signup?oauth=google", FRONTEND_URL)
      : new URL("/home", FRONTEND_URL);

    const response = NextResponse.redirect(redirectUrl);

    // Clear the verifier cookie
    response.cookies.delete("oauth_code_verifier");

    // Set auth cookies
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[OAUTH] Exchange error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", FRONTEND_URL));
  }
}
