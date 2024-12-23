// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { User } from "@prisma/client";
const roleToPathMap = {
  ADMIN: "/admin",
  USER: "/user",
  ROOM: "/room",
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET });
  console.log("Token:", token);

  if (!token) {
    console.warn("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = token.user as User;
  const { pathname } = req.nextUrl;

  console.log({
    currentPath: pathname,
    userRole: user.role,
    expectedPath: roleToPathMap[user.role],
  });

  // Check if the current path matches any protected route
  for (const [role, path] of Object.entries(roleToPathMap)) {
    if (pathname.startsWith(path)) {
      if (user.role !== role) {
        console.warn(
          `Unauthorized access: ${user.role} cannot access ${pathname}`
        );
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  console.log("Middleware passed successfully.");
  return NextResponse.next(); // Allow the request if everything matches
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
    "/user/:path*",
    "/room/:path*",
  ],
};
