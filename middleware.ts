import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/items/add", "/items/manage", "/profile", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Get auth token from cookies (backend sets it as 'sharebari_token')
    const token = request.cookies.get("sharebari_token")?.value;

    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/items/add",
    "/items/manage",
    "/profile",
    "/dashboard",
  ],
};
