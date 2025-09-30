import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and setup page
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/setup')
  ) {
    return NextResponse.next()
  }

  try {
    // Check if setup is needed
    const userCount = await prisma.user.count()

    if (userCount === 0) {
      // No users exist, redirect to setup
      return NextResponse.redirect(new URL('/setup', request.url))
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // If we can't check, allow the request to continue
    // This prevents blocking the app if there's a database issue
  }

  return NextResponse.next()
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
