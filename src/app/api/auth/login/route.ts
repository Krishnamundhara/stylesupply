import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Extract tokens from backend Set-Cookie headers
    const cookies = res.headers.getSetCookie();
    const response = NextResponse.json(data);

    // Parse and forward cookies with frontend-appropriate settings
    for (const cookie of cookies) {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");

      if (name === "access_token" || name === "refresh_token") {
        response.cookies.set(name, value, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: name === "access_token" ? 15 * 60 : 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    }

    return response;
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    return NextResponse.json(
      { error: { code: "LOGIN_ERROR", message: "Login failed" } },
      { status: 500 }
    );
  }
}
