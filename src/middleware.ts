import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
    const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

    // If it's an admin path and user is not an admin, redirect to home
    if ((isAdminPath || isAdminApi) && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
