// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { User } from "@prisma/client";

const roleToPathMap = {
  SUPER_ADMIN: ["/admin"],
  ADMIN: ["/admin"],
  USER: ["/user"],
  ROOM: ["/room"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET });

  if (!token) {
    console.warn("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = token.user as User;
  const { pathname } = req.nextUrl;

  const allowedPaths = roleToPathMap[user.role] || [];

  // Check if the current path matches any of the allowed paths for the user role
  const isAuthorized = allowedPaths.some((path) => pathname.startsWith(path));

  if (!isAuthorized) {
    console.warn(`Unauthorized access: ${user.role} cannot access ${pathname}`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow the request if the user role matches the allowed path
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/room/:path*"],
};
