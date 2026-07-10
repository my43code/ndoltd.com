import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret, isAdminIdentifier } from "@/lib/auth";

export async function requireAdmin(request) {
  const token = await getToken({ req: request, secret: getAuthSecret() });
  const identifier = token?.identifier || token?.email;

  if (!identifier || !isAdminIdentifier(identifier)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
