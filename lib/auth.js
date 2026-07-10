import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "@/lib/mongodb";
import AdminOtpChallenge from "@/models/AdminOtpChallenge";
import crypto from "crypto";

export function normalizeEmail(value) {
  return (value || "").toString().trim().toLowerCase();
}

export function normalizePhone(value) {
  return (value || "").toString().trim();
}

export function normalizeIdentifier(value) {
  const trimmed = (value || "").toString().trim();
  if (!trimmed) return "";

  if (trimmed.includes("@")) {
    return normalizeEmail(trimmed);
  }

  return normalizePhone(trimmed);
}

function splitEmailList(value) {
  return (value || "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function getAuthSecret() {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "change-me-in-env"
  );
}

export function getAdminEmails() {
  return Array.from(
    new Set([
      ...splitEmailList(process.env.ADMIN_EMAILS),
      normalizeEmail(process.env.ADMIN_EMAIL),
    ])
  );
}

export function getAdminPhones() {
  return Array.from(
    new Set(
      (process.env.ADMIN_PHONES || "")
        .split(",")
        .map((phone) => normalizePhone(phone))
        .filter(Boolean)
    )
  );
}

export function isAdminEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return false;

  if (getAdminEmails().includes(normalizedEmail)) {
    return true;
  }

  const allowedDomain = normalizeEmail(process.env.ADMIN_DOMAIN);
  if (allowedDomain && normalizedEmail.endsWith(`@${allowedDomain}`)) {
    return true;
  }

  return false;
}

export function isAdminIdentifier(identifier) {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) return false;

  if (isAdminEmail(normalizedIdentifier)) {
    return true;
  }

  return getAdminPhones().includes(normalizedIdentifier);
}

export function isValidAdminPassword(password) {
  return (process.env.ADMIN_PASSWORD || "").toString() === (password || "").toString();
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function checkOtpCode(identifier, code) {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier || !code) {
    return false;
  }

  await connectMongoDB();

  const challenge = await AdminOtpChallenge.findOne({
    identifier: normalizedIdentifier,
    purpose: "admin-login",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!challenge) {
    return false;
  }

  if (challenge.attempts >= 5) {
    return false;
  }

  const isMatch = challenge.codeHash === hashCode(code);
  challenge.attempts += 1;

  if (!isMatch) {
    await challenge.save();
    return false;
  }

  await challenge.save();
  return true;
}

export async function checkOtpWithSessionToken(sessionToken, code) {
  if (!sessionToken || !code) {
    return false;
  }

  await connectMongoDB();

  const challenge = await AdminOtpChallenge.findOne({
    sessionToken,
    purpose: "admin-login",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!challenge) {
    return false;
  }

  if (challenge.attempts >= 5) {
    return false;
  }

  const isMatch = challenge.codeHash === hashCode(code);

  if (!isMatch) {
    challenge.attempts += 1;
    await challenge.save();
    return false;
  }

  return true;
}

export async function consumeOtpWithSessionToken(sessionToken, code) {
  if (!sessionToken || !code) {
    return null;
  }

  await connectMongoDB();

  const challenge = await AdminOtpChallenge.findOne({
    sessionToken,
    purpose: "admin-login",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!challenge) {
    return null;
  }

  if (challenge.attempts >= 5) {
    return null;
  }

  if (challenge.codeHash !== hashCode(code)) {
    challenge.attempts += 1;
    await challenge.save();
    return null;
  }

  challenge.attempts += 1;
  challenge.isUsed = true;
  challenge.usedAt = new Date();
  await challenge.save();

  return challenge.identifier;
}

function buildOauthProviders() {
  const providers = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    );
  }

  return providers;
}

function buildCredentialsProvider() {
  return CredentialsProvider({
    name: "Admin Credentials",
    credentials: {
      sessionToken: { label: "Session Token", type: "text" },
      code: { label: "One-time code", type: "text" },
    },
    async authorize(credentials) {
      const sessionToken = (credentials?.sessionToken || "").toString();
      const code = (credentials?.code || "").toString();

      if (!sessionToken || !code) {
        return null;
      }

      const identifier = await consumeOtpWithSessionToken(sessionToken, code);
      if (!identifier) {
        return null;
      }

      return {
        id: identifier,
        identifier,
        name: process.env.ADMIN_NAME || "Admin",
        email: identifier.includes("@") ? identifier : undefined,
        role: "admin",
      };
    },
  });
}

export const authOptions = {
  secret: getAuthSecret(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [...buildOauthProviders(), buildCredentialsProvider()],
  callbacks: {
    async signIn({ user }) {
      const identifier = user?.email || user?.identifier;
      if (!identifier) {
        return "/login?error=AccessDenied";
      }

      if (!isAdminIdentifier(identifier)) {
        return "/login?error=AccessDenied";
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email || token.email;
        token.identifier = user.identifier || user.email || token.identifier;
        token.name = user.name || token.name;
        token.picture = user.image || token.picture;
        token.role = user.role || "admin";
        token.provider = account?.provider || token.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email || session.user.email;
        session.user.identifier = token.identifier || session.user.email || null;
        session.user.name = token.name || session.user.name;
        session.user.image = token.picture || session.user.image;
        session.user.role = token.role || (token.email || token.identifier ? "admin" : "user");
        session.user.provider = token.provider || null;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return `${baseUrl}/admin`;
    },
  },
 };
