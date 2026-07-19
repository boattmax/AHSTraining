import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if the user has completed their profile
    const hasCompletedProfile = token?.hasCompletedProfile;

    // Allow them to visit the complete-profile page, api routes, or static files
    const isPublicOrAuthPath = path.startsWith('/api') || 
                               path.startsWith('/_next') || 
                               path === '/complete-profile' || 
                               path === '/login' || 
                               path === '/register' ||
                               path === '/';

    if (token && !hasCompletedProfile && !isPublicOrAuthPath) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    }

    // Protect admin routes
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if authorized, false otherwise. We handle the logic above.
      authorized: ({ token }) => !!token,
    },
  }
);

// Define which routes to protect
export const config = {
  matcher: [
    "/admin", "/admin/:path*", 
    "/dashboard", "/dashboard/:path*", 
    "/profile", "/profile/:path*", 
    "/complete-profile"
  ],
};
