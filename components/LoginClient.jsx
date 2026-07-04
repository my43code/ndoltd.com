"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const errorMessages = {
  AccessDenied: "That account is not allowed to administer this site.",
  CredentialsSignin: "Invalid admin email or password.",
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
  const { status } = useSession();
  const [providers, setProviders] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    }
  }, [router, status]);

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
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/admin",
      email: credentials.email,
      password: credentials.password,
    });

    if (result?.error) {
      setError(getErrorMessage(result.error));
      setLoadingProvider("");
      return;
    }

    router.push(result?.url || "/admin");
  }

  if (status === "loading") {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
          Checking your session...
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.14),_transparent_26%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.92))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-15" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Admin access
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Sign in with Google, GitHub, or your admin password.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            Only approved admin accounts can enter the dashboard. Use the
            provider buttons below, or sign in with your shared admin email and
            password if that is how your team works.
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

          <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
            <Link
              href="/"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Back to home
            </Link>
            <span className="h-4 w-px bg-white/20" />
            <span>After sign in, you will be sent to the dashboard.</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
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
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                  Admin email
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) =>
                    setCredentials((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Password
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
                disabled={loadingProvider === "credentials"}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingProvider === "credentials"
                  ? "Signing in..."
                  : "Sign in with password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
