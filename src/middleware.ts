// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check for admin routes
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check for business routes
    if (path.startsWith('/business') && token?.role !== 'BUSINESS_OWNER') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check for moderator routes
    if (path.startsWith('/moderator') && token?.role !== 'MODERATOR') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/business/:path*',
    '/moderator/:path*',
    '/profile/:path*',
  ]
}