import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAccess = request.cookies.get('vip_access')?.value;

  if (!hasAccess || hasAccess !== 'true') {
    // Allow access to the login page itself
    if (request.nextUrl.pathname === '/vip-portal/login') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/vip-portal/login', request.url));
  }

  // If user is authenticated and tries to access login page, redirect to VIP portal
  if (request.nextUrl.pathname === '/vip-portal/login') {
    return NextResponse.redirect(new URL('/vip-portal', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/vip-portal/:path*',
};
