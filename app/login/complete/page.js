"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("token") || "";
  const code = searchParams.get("code") || "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionToken || !code) {
      router.replace("/login");
    }
  }, [router, sessionToken, code]);

  useEffect(() => {
    async function completeSignIn() {
      if (!sessionToken || !code) return;

      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/admin",
        sessionToken,
        code,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push(result?.url || "/admin");
    }

    completeSignIn();
  }, [router, sessionToken, code]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-semibold">Completing sign-in</h1>
        <p className="mb-6 text-sm text-slate-600">
          Verifying your one-time code and signing you in now.
        </p>
        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {loading ? (
          <div className="text-sm text-slate-600">Finishing sign-in...</div>
        ) : (
          <div className="text-sm text-slate-600">If you are not redirected, refresh the page.</div>
        )}
      </div>
    </section>
  );
}
