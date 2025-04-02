import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/expenses'];

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    console.log("Redirecting to login...");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/expenses/:path*"],
};