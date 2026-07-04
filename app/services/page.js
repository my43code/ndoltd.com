import Link from "next/link";
import { ArrowRight, Layers3, Sparkles, ShieldCheck } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import MediaFrame from "@/components/MediaFrame";
import { connectMongoDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export const revalidate = 3600;

async function getServices() {
  try {
    await connectMongoDB();
    return await Service.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load services:", error);
    }
    return [];
  }
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-xl hover:border-emerald-400/50 hover:bg-white/12 transition-all duration-300 card-hover animate-fade-in-up glow-pulse">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200 group-hover:scale-110 transition group-hover:shadow-lg group-hover:shadow-emerald-500/30">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-white text-gradient">{value}</p>
        </div>
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p> : null}
    </div>
  );
}

export default async function ServicesPage() {
  const services = await getServices();
  const featuredService = services[0];
  const videoCount = services.filter((service) => service.video).length;
  const imageCount = services.filter((service) => service.image && !service.video).length;

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.12),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.08),transparent_20%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.72)_50%,rgba(6,78,59,0.48)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="max-w-2xl">
            <span className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 backdrop-blur">
              <Sparkles size={16} />
              Services
            </span>

            <h1 className="hero-fade-up-delay-1 mt-6 text-5xl font-black tracking-tight md:text-7xl">
              Premium digital services built to ship with confidence.
            </h1>

            <p className="hero-fade-up-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              We deliver tailored digital solutions that drive growth and innovation for businesses of all sizes.
            </p>

            <div className="hero-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Start a project
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/updates"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
              >
                View updates
              </Link>
            </div>
          </div>

          <div className="hero-fade-up-delay-4 relative">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
              <MediaFrame
                image={featuredService?.image || "/images/project1.webp"}
                video={featuredService?.video}
                alt={featuredService?.title || "Featured service"}
                className="min-h-[420px]"
                overlay
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur md:grid-cols-3">
                  <MetricCard
                    icon={Layers3}
                    label="Services"
                    value={services.length}
                    detail="Live records from the services collection."
                  />
                  <MetricCard
                    icon={Sparkles}
                    label="Videos"
                    value={videoCount}
                    detail="Entries with motion content or video demos."
                  />
                  <MetricCard
                    icon={ShieldCheck}
                    label="Images"
                    value={imageCount}
                    detail="Visual showcases ready for the front page."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Portfolio"
          title="Browse the service library"
          subtitle="The cards below use the improved media treatment, hover motion, and editorial spacing."
        />

        {services.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No services available in the database yet.
          </div>
        )}
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                Ready to move
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Let us shape a cleaner digital experience for your team.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-lg">
                Bring your idea, your existing system, or your support request.
                We will match it with the right service from the dashboard.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Contact us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
