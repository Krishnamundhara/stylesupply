import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Forward cookies from the incoming Next.js request to the backend.
 * This passes along access_token and refresh_token httpOnly cookies.
 */
function forwardCookies(request: NextRequest): string {
  const cookieHeader = request.headers.get('cookie');
  return cookieHeader ?? '';
}

/**
 * Extract Set-Cookie headers from backend response and apply them to the Next.js response.
 */
function applyCookies(backendRes: Response, nextRes: NextResponse): void {
  const cookies = backendRes.headers.getSetCookie();
  for (const cookie of cookies) {
    const [nameValue] = cookie.split(';');
    const [name, value] = nameValue.split('=');
    if (name === 'access_token' || name === 'refresh_token') {
      nextRes.cookies.set(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: name === 'access_token' ? 15 * 60 : 7 * 24 * 60 * 60,
        path: '/',
      });
    }
  }
}

/**
 * Proxy a GET request to the backend, forwarding cookies and query params.
 */
export async function proxyGet(
  backendPath: string,
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const url = new URL(backendPath, BACKEND_URL);
    // Forward query params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: forwardCookies(request),
      },
    });

    const data = await res.json().catch(() => ({}));
    const nextRes = NextResponse.json(data, { status: res.status });
    applyCookies(res, nextRes);
    return nextRes;
  } catch (error) {
    console.error(`[PROXY] GET ${backendPath} error:`, error);
    return NextResponse.json(
      { error: { code: 'PROXY_ERROR', message: 'Backend request failed' } },
      { status: 502 },
    );
  }
}

/**
 * Proxy a POST request to the backend, forwarding cookies, body, and CSRF token.
 */
export async function proxyPost(
  backendPath: string,
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));

    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: forwardCookies(request),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const nextRes = NextResponse.json(data, { status: res.status });
    applyCookies(res, nextRes);
    return nextRes;
  } catch (error) {
    console.error(`[PROXY] POST ${backendPath} error:`, error);
    return NextResponse.json(
      { error: { code: 'PROXY_ERROR', message: 'Backend request failed' } },
      { status: 502 },
    );
  }
}

/**
 * Proxy a PATCH request to the backend, forwarding cookies and body.
 */
export async function proxyPatch(
  backendPath: string,
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}));

    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: forwardCookies(request),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const nextRes = NextResponse.json(data, { status: res.status });
    applyCookies(res, nextRes);
    return nextRes;
  } catch (error) {
    console.error(`[PROXY] PATCH ${backendPath} error:`, error);
    return NextResponse.json(
      { error: { code: 'PROXY_ERROR', message: 'Backend request failed' } },
      { status: 502 },
    );
  }
}

/**
 * Proxy a DELETE request to the backend, forwarding cookies.
 */
export async function proxyDelete(
  backendPath: string,
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: forwardCookies(request),
      },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => ({}));
    const nextRes = NextResponse.json(data, { status: res.status });
    applyCookies(res, nextRes);
    return nextRes;
  } catch (error) {
    console.error(`[PROXY] DELETE ${backendPath} error:`, error);
    return NextResponse.json(
      { error: { code: 'PROXY_ERROR', message: 'Backend request failed' } },
      { status: 502 },
    );
  }
}
