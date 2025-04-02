import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("✅ Middleware executed!"); // Log to check if it runs

  const authToken = req.cookies.get("authToken")?.value;
  console.log("🔍 Auth Token:", authToken);

  if (!authToken) {
    console.log("🔄 Redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all pages except login & static assets
export const config = {
  matcher: ["/((?!login|_next|favicon.ico).*)"], // Excludes /login & static files
};
