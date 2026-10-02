import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // Try to logout on backend (ignore errors - token might be expired)
  if (accessToken) {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
      });
    } catch {
      // Ignore - we'll clear cookies anyway
    }
  }

  // Clear all auth cookies on frontend domain
  const response = NextResponse.json({ success: true });

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("oauth_code_verifier");

  return response;
}
