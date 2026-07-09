import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/SectionTitle";
import Image from "next/image";
import { getSiteAbout } from "@/lib/siteContent";
import { getTelHref, getWhatsAppHref } from "@/lib/contactLinks";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

function DetailRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex gap-3">
      <Icon className="mt-1 shrink-0 text-emerald-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm leading-7 text-slate-200">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      {content}
    </div>
  );
}

export default async function ContactPage() {
  const about = await getSiteAbout();
  const contact = about.contact || {};
  const companyName = contact.companyName || "Nexus DevOps Limited";
  const tagline =
    contact.tagline ||
    "Digital systems, modern websites, and dependable support.";
  const mapHref =
    contact.mapUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(contact.address || companyName)}`;
  const whatsappHref = getWhatsAppHref(contact.whatsapp, contact.phone);
  const phoneHref = getTelHref(contact.phone);

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.12),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.1),transparent_20%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.72)_50%,rgba(6,78,59,0.48)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 backdrop-blur">
              Contact
            </span>
            <h1 className="hero-fade-up-delay-1 mt-6 text-5xl font-black tracking-tight md:text-7xl">
              Let us talk about your next build.
            </h1>
            <p className="hero-fade-up-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              {tagline} Reach out with a project brief, support request, or
              partnership idea and we will respond as soon as possible. 
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <SectionTitle
          eyebrow="Get in touch"
          title="Live contact details and response form"
          subtitle="Talk to us about your project. "
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative aspect-[16/10]">
              <Image
                src="/images/team.webp"
                alt={`${companyName} contact`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                  Office profile
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {companyName}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <DetailRow
                icon={FaMapMarkerAlt}
                label="Address"
                value={
                  contact.address ||
                  "Add your office address in the About section."
                }
                href={mapHref}
              />
              <DetailRow
                icon={FaEnvelope}
                label="Email"
                value={contact.email || "info@ndoltd.com"}
                href={`mailto:${contact.email || "info@ndoltd.com"}`}
              />
              <DetailRow
                icon={FaPhoneAlt}
                label="Phone"
                value={contact.phone || "+675 78337326"}
                href={phoneHref}
              />
              <DetailRow
                icon={FaWhatsapp}
                label="WhatsApp"
                value={contact.phone || "+675 78337326"}
                href={whatsappHref}
              />

              {contact.hours ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Hours
                  </p>
                  <p className="mt-1 text-sm leading-7 text-slate-200">
                    {contact.hours}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`mailto:${contact.email || "info@ndoltd.com"}`}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Email us
                </a>
                <a
                  href={mapHref}
                  target={mapHref.startsWith("http") ? "_blank" : undefined}
                  rel={mapHref.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  Open map
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
