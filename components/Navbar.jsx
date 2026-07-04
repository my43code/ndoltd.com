"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Updates", href: "/updates" },
  { name: "Contact Us", href: "/contact" },
  { name: "Login", href: "/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-slate-900/80 bg-slate-950/90 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/10 transition-shadow duration-300 animate-fade-in-down">
      {/* Animated background line */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 animate-shimmer"></div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="animate-fade-in">
          <Logo />
        </div>

        <nav className="hidden items-center gap-8 font-semibold text-base md:flex md:text-lg">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative text-slate-300 transition duration-300 hover:text-white animate-fade-in-down"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <button
          className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:bg-slate-900 hover:border-emerald-500 hover:text-emerald-400 hover:scale-110 md:hidden animate-fade-in-right"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} className="animate-rotate-in" /> : <Menu size={24} className="animate-fade-in" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-900 bg-slate-950 md:hidden animate-slide-in-down">
          <nav className="flex flex-col gap-5 px-6 py-6">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-slate-300 transition hover:text-white hover:translate-x-1 animate-slide-in-left link-hover"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
