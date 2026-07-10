"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("token") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!sessionToken) {
      router.replace("/login");
    }
  }, [router, sessionToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResendMessage("");

    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, code }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Unable to verify code.");
      return;
    }

    router.push(`/login/complete?token=${encodeURIComponent(sessionToken)}&code=${encodeURIComponent(code)}`);
  }

  async function handleResend() {
    if (!sessionToken) {
      router.replace("/login");
      return;
    }

    setResendLoading(true);
    setError("");
    setResendMessage("");

    const response = await fetch("/api/auth/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });

    const data = await response.json();
    setResendLoading(false);

    if (!response.ok) {
      setError(data?.error || "Unable to resend verification code.");
      return;
    }

    setResendMessage(data?.message || "A new code was sent.");
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-semibold">Enter your verification code</h1>
        <p className="mb-6 text-sm text-slate-600">
          A one-time verification code was sent to your email or phone. Enter it here to continue.
        </p>
        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-400"
            placeholder="123456"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-white transition hover:bg-emerald-400 disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition hover:border-emerald-400 disabled:opacity-70"
          >
            {resendLoading ? "Resending code..." : "Resend verification code"}
          </button>
          {resendMessage ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
              {resendMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
