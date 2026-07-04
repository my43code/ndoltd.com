import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

function normalizeEmail(value) {
  return (value || "").toString().trim().toLowerCase();
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
      email: { label: "Email", type: "email", placeholder: "admin@example.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = normalizeEmail(credentials?.email);
      const password = (credentials?.password || "").toString();
      const adminPassword = (process.env.ADMIN_PASSWORD || "").toString();

      if (!email || !password || !adminPassword) {
        return null;
      }

      if (!isAdminEmail(email)) {
        return null;
      }

      if (password !== adminPassword) {
        return null;
      }

      return {
        id: email,
        name: process.env.ADMIN_NAME || "Admin",
        email,
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
      if (!user?.email) {
        return "/login?error=AccessDenied";
      }

      if (!isAdminEmail(user.email)) {
        return "/login?error=AccessDenied";
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email || token.email;
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
        session.user.name = token.name || session.user.name;
        session.user.image = token.picture || session.user.image;
        session.user.role = token.role || (token.email ? "admin" : "user");
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
