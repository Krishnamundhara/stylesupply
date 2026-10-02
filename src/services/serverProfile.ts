import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ServerUser {
  id: string;
  email: string;
  name: string | null;
}

export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const user = data.user;
    if (!user) return null;
    const firstName = user.name?.split(" ")[0] || null;
    return { ...user, name: firstName };
  } catch {
    return null;
  }
}
