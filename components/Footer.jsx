import Link from "next/link";
import Logo from "./Logo";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { getSiteAbout } from "@/lib/siteContent";
import { getTelHref, getWhatsAppHref } from "@/lib/contactLinks";

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:-translate-y-1 hover:bg-emerald-400 hover:text-slate-950 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-110 glow-pulse"
    >
      {children}
    </a>
  );
}

export default async function Footer() { 
  const about = await getSiteAbout();
  const contact = about.contact || {};
  const companyName = contact.companyName || "Nexus DevOps Limited";
  const tagline =
    contact.tagline ||
    "Digital systems, modern websites, and dependable support.";
  const whatsappHref = getWhatsAppHref(contact.whatsapp, contact.phone);
  const phoneHref = getTelHref(contact.phone);

  return (
    <footer className="mt-16 overflow-hidden border-t border-slate-200 bg-slate-950 text-white">
      <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.75fr_0.95fr]">
          <div className="animate-fade-in-left">
            <div className="mb-5 animate-fade-in-up">
              <Logo />
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <SocialLink href={contact.facebook} label="Facebook">
                <FaFacebookF />
              </SocialLink>
              <SocialLink href={contact.linkedin} label="LinkedIn">
                <FaLinkedinIn />
              </SocialLink>
              <SocialLink href={whatsappHref} label="WhatsApp">
                <FaWhatsapp />
              </SocialLink>
              <SocialLink href={`mailto:${contact.email}`} label="Email">
                <FaEnvelope />
              </SocialLink>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h4 className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300 animate-bounce-in">
              Explore
            </h4>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300">
              <Link href="/about" className="transition hover:text-white hover:translate-x-1">
                About Us
              </Link>
              <Link href="/services" className="transition hover:text-white hover:translate-x-1">
                Services
              </Link>
              <Link href="/updates" className="transition hover:text-white hover:translate-x-1">
                Updates
              </Link>
              <Link href="/contact" className="transition hover:text-white hover:translate-x-1">
                Contact Us
              </Link>
              <Link href="/login" className="transition hover:text-white hover:translate-x-1">
                Login
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-right">
            <h4 className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300 animate-bounce-in">
              Contact
            </h4>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{companyName}</p>

              {contact.address ? (
                <div className="flex gap-3 transition hover:text-white">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-emerald-300" />
                  <p>{contact.address}</p>
                </div>
              ) : null}

              {contact.email ? (
                <div className="flex gap-3">
                  <FaEnvelope className="mt-1 shrink-0 text-emerald-300" />
                  <a className="transition hover:text-white" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </div>
              ) : null}

              {contact.phone ? (
                <div className="flex gap-3">
                  <FaPhoneAlt className="mt-1 shrink-0 text-emerald-300" />
                  <a className="transition hover:text-white" href={phoneHref}>
                    {contact.phone}
                  </a>
                </div>
              ) : null}

              {contact.hours ? <p>{contact.hours}</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-slate-400 animate-fade-in">
        Copyright 2026 Nexus DevOps Limited. All rights reserved.
      </div>
    </footer>
  );
}
