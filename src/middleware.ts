import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Launch mode: "prelaunch" gates most routes, "live" runs normal auth
const LAUNCH_MODE = process.env.LAUNCH_MODE || "prelaunch";
const BYPASS_SECRET = process.env.BYPASS_SECRET || "ss-internal-preview";
const BYPASS_COOKIE = "ss_bypass";

// Routes accessible in prelaunch mode (no auth needed)
const prelaunchAllowedRoutes = [
  "/",
  "/request-access",
  "/faq",
  "/howitworks",
  "/about",
  "/accessibility",
  "/your-privacy-choices",
  "/sitemap",
  "/coming-soon",
];

// Routes that require authentication
const protectedRoutes = [
  "/home",
  "/accounts",
  "/box",
  "/cart",
  "/checkout",
  "/closet",
  "/wishlist",
];

// Routes that redirect to /home if already authenticated
const authRoutes = ["/login", "/signup", "/forgot-password"];

// Public routes accessible without auth (but gated in prelaunch)
const publicRoutes = ["/brands", "/collections", "/products", "/blogs", "/join"];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Handle bypass: ?bypass=secret sets a cookie
  const bypassParam = request.nextUrl.searchParams.get("bypass");
  if (bypassParam === BYPASS_SECRET) {
    const redirectUrl = new URL(pathname, request.url);
    redirectUrl.searchParams.delete("bypass");
    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.cookies.set(BYPASS_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    // Also set client-readable cookie for UI components
    redirectResponse.cookies.set("ss_bypass_ui", "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return redirectResponse;
  }

  const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "1";
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const hasValidSession = !!accessToken || !!refreshToken;

  // Prelaunch mode: gate most routes unless bypassed
  if (LAUNCH_MODE === "prelaunch" && !hasBypass) {
    const isAllowed = matchesRoute(pathname, prelaunchAllowedRoutes);
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  // Live mode (or bypassed): normal auth logic

  // Protected routes require auth
  if (matchesRoute(pathname, protectedRoutes) && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes redirect to /home if logged in.
  // Exception: /signup?oauth=... is the OAuth onboarding completion step —
  // the user is authenticated but still needs to provide phone + address.
  const isOAuthOnboarding =
    pathname === "/signup" && request.nextUrl.searchParams.has("oauth");
  if (matchesRoute(pathname, authRoutes) && hasValidSession && !isOAuthOnboarding) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Root path: logged-in users go to /home, others see landing
  if (pathname === "/" && hasValidSession) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|images|videos|logo).*)",
  ],
};
