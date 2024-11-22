import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// This function will run for specified routes only
export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Update matcher to only protect specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',     // Protect dashboard routes
    '/profile/:path*',       // Protect profile routes
    '/business/:path*',      // Protect business management routes
    // Add other protected routes here
  ]
}