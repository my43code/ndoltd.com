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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_35px_rgba(2,6,23,0.06)] animate-fade-in-down">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-emerald-400/0" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="animate-fade-in">
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 px-2 py-2 font-semibold md:flex">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-sm text-slate-600 transition duration-300 hover:bg-white hover:text-slate-950 animate-fade-in-down"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {link.name}
              <span className="absolute inset-x-3 bottom-2 h-[2px] w-[calc(100%-1.5rem)] scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </nav>

        <button
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={20} className="animate-rotate-in" /> : <Menu size={20} className="animate-fade-in" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 md:hidden animate-slide-in-down">
          <nav className="flex flex-col gap-2 px-6 py-5">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-2xl px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 animate-slide-in-left"
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
