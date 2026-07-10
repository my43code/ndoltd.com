"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const errorMessages = {
  AccessDenied: "That account is not allowed to administer this site.",
  CredentialsSignin: "Invalid admin email or verification code.",
  Configuration: "Authentication is not configured yet.",
  OAuthAccountNotLinked:
    "Please sign in with the same provider you used before.",
  default: "Sign in failed. Please try again.",
};

function getErrorMessage(errorCode) {
  if (!errorCode) return "";
  return errorMessages[errorCode] || errorMessages.default;
}

function ProviderIcon({ id }) {
  if (id === "google") {
    return <FaGoogle className="text-white" />;
  }

  if (id === "github") {
    return <FaGithub className="text-white" />;
  }

  return <span className="inline-block h-3 w-3 rounded-full bg-white" />;
}

export default function LoginClient({ initialErrorCode = "" }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [otpPending, setOtpPending] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/admin");
    }
  }, [router, session, status]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProviders() {
      const response = await getProviders();
      if (mounted) {
        setProviders(response || {});
      }
    }

    loadProviders();

    return () => {
      mounted = false;
    };
  }, []);

  const providerList = providers
    ? Object.values(providers).filter((provider) => provider.id !== "credentials")
    : [];
  const urlError = getErrorMessage(initialErrorCode);
  const activeError = error || urlError;

  async function handleOAuthSignIn(providerId) {
    setLoadingProvider(providerId);
    setError("");
    await signIn(providerId, { callbackUrl: "/admin" });
  }

  async function handleCredentialsSubmit(event) {
    event.preventDefault();
    setLoadingProvider("credentials");
    setOtpPending(true);
    setError("");

    const response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: credentials.email, password: credentials.password }),
    });

    const data = await response.json();
    setLoadingProvider("");
    setOtpPending(false);

    if (!response.ok) {
      setError(data?.error || "Unable to send a code right now.");
      return;
    }

    const sessionToken = data?.sessionToken;
    if (!sessionToken) {
      setError("Unable to start verification.");
      return;
    }

    router.push(`/login/verify?token=${encodeURIComponent(sessionToken)}`);
  }

  if (!hydrated || status === "loading") {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
          Checking your session...
        </div>
      </section>
    );
  }

  if (status === "authenticated" && session?.user) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold">You are already signed in</h2>
          <p className="mt-3 text-sm text-slate-300">Redirecting you to the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.14),_transparent_26%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.92))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-15" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Admin access
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-6xl">
            Sign in with Google, GitHub, or admin password + OTP.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
            Only approved admin accounts can enter the dashboard. Enter the
            admin password first, then verify with a one-time code sent by email
            or SMS.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              OAuth protected
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              JWT session
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Admin allowlist
            </span>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Back to home
            </Link>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <span>After sign in, you will be sent to the dashboard.</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold text-white">
              Choose a sign-in method
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Use whichever provider your account belongs to. Unauthorized
              accounts are blocked automatically.
            </p>

            {activeError ? (
              <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {activeError}
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {providerList.length > 0 ? (
                providerList.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleOAuthSignIn(provider.id)}
                    disabled={loadingProvider === provider.id}
                    className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-black/30 ring-1 ring-white/10">
                        <ProviderIcon id={provider.id} />
                      </span>
                      <span>
                        <span className="block text-base">{provider.name}</span>
                        <span className="block text-xs text-slate-400">
                          Sign in with your {provider.name} account
                        </span>
                      </span>
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {loadingProvider === provider.id ? "Opening..." : "Continue"}
                    </span>
                  </button>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  No OAuth providers are configured yet.
                </p>
              )}
            </div>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                or
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Admin email or phone
                </label>
                <input
                  type="text"
                  value={credentials.email}
                  onChange={(event) =>
                    setCredentials((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60"
                  placeholder="admin@example.com or +123456789"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Admin password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) =>
                    setCredentials((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingProvider === "credentials" || otpPending}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingProvider === "credentials" || otpPending
                  ? "Sending code..."
                  : "Send verification code"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
