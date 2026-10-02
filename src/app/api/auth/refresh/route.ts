import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: { code: "NO_REFRESH_TOKEN", message: "No refresh token" } },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!res.ok) {
      // Clear invalid cookies
      const response = NextResponse.json(
        { error: { code: "REFRESH_FAILED", message: "Token refresh failed" } },
        { status: 401 }
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // For now, call the backend and get tokens directly
    const tokenRes = await fetch(`${BACKEND_URL}/api/auth/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!tokenRes.ok) {
      const response = NextResponse.json(
        { error: { code: "REFRESH_FAILED", message: "Token refresh failed" } },
        { status: 401 }
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await tokenRes.json();

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[AUTH] Refresh error:", error);
    const response = NextResponse.json(
      { error: { code: "REFRESH_ERROR", message: "Token refresh failed" } },
      { status: 500 }
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}
