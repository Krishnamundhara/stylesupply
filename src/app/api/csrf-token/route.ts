import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/csrf-token`, {
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to get CSRF token" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Forward the csrf cookie from backend
    const response = NextResponse.json(data);

    // Copy cookies from backend response
    const cookies = res.headers.getSetCookie();
    for (const cookie of cookies) {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      if (name === "csrf-token") {
        response.cookies.set(name, value, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
      }
    }

    return response;
  } catch (error) {
    console.error("[CSRF] Error:", error);
    return NextResponse.json(
      { error: "Failed to get CSRF token" },
      { status: 500 }
    );
  }
}
