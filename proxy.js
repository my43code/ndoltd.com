import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret, isAdminEmail } from "@/lib/auth";

export async function proxy(request) {
  const token = await getToken({ req: request, secret: getAuthSecret() });

  if (!token?.email || !isAdminEmail(token.email)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
