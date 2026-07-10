import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongoDB } from "@/lib/mongodb";
import AdminOtpChallenge from "@/models/AdminOtpChallenge";
import { normalizeIdentifier } from "@/lib/auth";

function generateCode() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionToken = (body?.sessionToken || "").toString();

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token is required." }, { status: 400 });
    }

    await connectMongoDB();

    const challenge = await AdminOtpChallenge.findOne({
      sessionToken,
      purpose: "admin-login",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!challenge) {
      return NextResponse.json({ error: "No active verification session was found." }, { status: 400 });
    }

    const identifier = normalizeIdentifier(challenge.identifier);
    if (!identifier) {
      return NextResponse.json({ error: "Unable to resend code for this session." }, { status: 400 });
    }

    const code = generateCode();
    challenge.codeHash = hashCode(code);
    challenge.attempts = 0;
    challenge.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await challenge.save();

    const deliveryMode = process.env.OTP_DELIVERY_MODE || "email";
    const deliveryTarget = identifier;

    if (deliveryMode === "sms") {
      if (!process.env.OTP_SMS_WEBHOOK_URL) {
        return NextResponse.json({ error: "SMS delivery is not configured." }, { status: 500 });
      }

      await fetch(process.env.OTP_SMS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: deliveryTarget, code, purpose: "admin-login" }),
      });
    } else {
      const resendApiKey = process.env.RESEND_API_KEY;
      const resendFrom = process.env.RESEND_FROM_EMAIL || "no-reply@example.com";

      if (!resendApiKey) {
        return NextResponse.json({ error: "Resend email service is not configured." }, { status: 500 });
      }

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: deliveryTarget,
          subject: "Your admin verification code",
          html: `<p>Your admin verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
          text: `Your admin verification code is ${code}. This code expires in 10 minutes.`,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error("Resend email failed", resendResponse.status, errorText);
        return NextResponse.json({ error: "Unable to send verification code via Resend." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "A new verification code was sent." });
  } catch (error) {
    console.error("OTP resend failed", error);
    return NextResponse.json({ error: "Unable to resend verification code." }, { status: 500 });
  }
}
