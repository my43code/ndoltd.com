import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret, isAdminEmail } from "@/lib/auth";

export async function requireAdmin(request) {
  const token = await getToken({ req: request, secret: getAuthSecret() });

  if (!token?.email || !isAdminEmail(token.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
