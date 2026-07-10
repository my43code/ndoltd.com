import { NextResponse } from "next/server";
import { checkOtpWithSessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionToken = (body?.sessionToken || "").toString();
    const code = (body?.code || "").toString();

    if (!sessionToken || !code) {
      return NextResponse.json({ error: "Session token and code are required." }, { status: 400 });
    }

    const isValid = await checkOtpWithSessionToken(sessionToken, code);
    if (!isValid) {
      return NextResponse.json({ error: "No active verification code found." }, { status: 400 });
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("OTP verify failed", error);
    return NextResponse.json({ error: "Unable to verify code." }, { status: 500 });
  }
}
