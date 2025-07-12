// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ✅ Include ALL public routes
  const publicPaths = ["/login", "/signup", "/contact"];
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  const token = request.cookies.get("token")?.value;
  const isAuth = Boolean(token);

  // ✅ Redirect authenticated users away from public pages
  if (isPublic && isAuth) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // ✅ Redirect unauthenticated users away from private pages
  if (!isPublic && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ Update matcher to explicitly include all protected + public pages
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/contact",
    "/profile/:path*",
    "/slides/:path*",
    "/upload/:path*",
    "/fhir-gateway/:path*",
    "/tissue/:path*",
    "/blog/:path*",
  ],
};
