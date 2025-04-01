import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import cookie from 'cookie';

// Middleware to protect routes
export function middleware(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  
  // Check if the authToken cookie exists
  if (!cookies.authToken) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if not authenticated
  }
  
  try {
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if token is invalid
  }
}

// Apply this middleware to protect routes
export const config = {
  matcher: ['/dashboard', '/profile'], // Specify which paths to protect
};
