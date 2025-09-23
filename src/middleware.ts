import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = pathname.startsWith("/mars") || pathname.startsWith("/santender");
  if (!needsAuth) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const client = token.client as "mars" | "santender" | undefined;
  const clients = (token.clients as ("mars" | "santender")[]) || [];

  // If no chosen client but multiple available, send to chooser
  if (!client && clients.length > 1) {
    return NextResponse.redirect(new URL("/choose-client", req.url));
  }

  // Enforce right-space access
  if (pathname.startsWith("/mars") && client !== "mars") {
    return NextResponse.redirect(new URL("/mars/not-authorized", req.url));
  }
  if (pathname.startsWith("/santender") && client !== "santender") {
    return NextResponse.redirect(new URL("/santender/not-authorized", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/mars/:path*", "/santender/:path*"] };
