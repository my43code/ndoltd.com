import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Space_Mono } from "next/font/google";

export const dynamic = "force-dynamic";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://nexusdevops.com"),
  title: {
    default: "Nexus DevOps Limited | Modern Websites & IT Solutions",
    template: "%s | Nexus DevOps Limited",
  },
  description:
    "Nexus DevOps Limited builds modern websites, digital systems, and IT support solutions for businesses in Papua New Guinea and beyond.",
  keywords: [
    "Nexus DevOps",
    "PNG web development",
    "IT support",
    "digital solutions",
    "website design",
    "Next.js development",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nexus DevOps Limited | Modern Websites & IT Solutions",
    description:
      "Modern websites, digital systems, and dependable support for growing businesses.",
    url: "https://nexusdevops.com",
    siteName: "Nexus DevOps Limited",
    type: "website",
    images: [
      {
        url: "/images/project1.webp",
        width: 1200,
        height: 630,
        alt: "Nexus DevOps showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus DevOps Limited | Modern Websites & IT Solutions",
    description:
      "Modern websites, digital systems, and dependable support for growing businesses.",
    images: ["/images/project1.webp"],
  },
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="font-space-mono flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#f8fafc_65%,#eef2ff_100%)] text-slate-800 antialiased selection:bg-emerald-300 selection:text-slate-950">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
