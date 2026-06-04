import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin and /api/admin routes, except for the login route itself
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !pathname.startsWith('/admin/login') && !pathname.startsWith('/api/admin/login')) {
    
    const adminSession = req.cookies.get('admin_session')?.value;

    if (adminSession === 'authenticated') {
      return NextResponse.next();
    }

    // Redirect to login page if not authenticated
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
