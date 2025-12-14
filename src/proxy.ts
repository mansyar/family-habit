import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/api/auth", "/_offline"];

// Routes that are only for child mode (require child session)
const childRoutes = ["/play", "/rewards"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for session token cookie (set by better-auth)
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Redirect to login if not authenticated
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For child routes, check if child session is active (stored in cookie)
  if (childRoutes.some((route) => pathname.startsWith(route))) {
    const childSessionId = request.cookies.get("childSessionId")?.value;
    if (!childSessionId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*).*)",
  ],
};
