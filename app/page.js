import SectionTitle from "@/components/SectionTitle";
import FloatingActions from "@/components/FloatingActions";
import SlidingShow from "@/components/SlidingShow";
import Link from "next/link";
import Image from "next/image";
import { connectMongoDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import Project from "@/models/Project";

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

async function getProjects() {
  try {
    await connectMongoDB();
    return await Project.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load projects:", error);
    }
    return [];
  }
}

function MediaPreview({ item, alt }) {
  const imageSrc = item?.image || "/images/project1.webp";
  const videoSrc = item?.video || item?.videoUrl || "";

  if (videoSrc) {
    return (
      <div className="relative h-[240px] w-full overflow-hidden rounded-xl bg-black">
        <video
          controls
          preload="metadata"
          className="h-full w-full rounded-xl object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-xl">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="rounded-xl object-cover"
      />
    </div>
  );
}

function HeroCard({ title, description, floating = false, delayClass = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl ${
        floating ? "hero-float" : ""
      } ${delayClass}`}
    >
      <p className="text-xs uppercase tracking-[0.32em] text-emerald-200">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-200">{description}</p>
    </div>
  );
}

export default async function HomePage() {
  let services = [];
  let projects = [];

  try {
    [services, projects] = await Promise.all([getServices(), getProjects()]);
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Data loading error:", error);
    }
  }

  const slideshowItems = [...projects, ...services]
    .filter((item) => item?.image)
    .slice(0, 3)
    .map((item, index) => ({
      id: String(item._id || index + 1),
      title: item.title || "Featured story",
      subtitle:
        item.shortDescription || item.description || "A recent highlight from our work.",
      image: item.image,
      badge: projects.includes(item) ? "Project" : "Service",
    }));

  return (
    <main>
      <FloatingActions />

      <section className="relative min-h-screen overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-55"
            preload="auto"
            aria-hidden="true"
          >
            <source src="/video/tech-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.78)_45%,rgba(6,78,59,0.6)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(250,204,21,0.14),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.16),transparent_20%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-15" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 md:px-8">
          <div className="max-w-4xl">
            <span className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 backdrop-blur">
              Web development • IT support • Digital solutions
            </span>

            <h1 className="hero-fade-up-delay-1 mt-6 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              <span className="block">Building polished digital systems</span>
              <span className="hero-shimmer block bg-gradient-to-r from-emerald-300 via-white to-yellow-300 bg-clip-text text-transparent">
                for ambitious PNG businesses.
              </span>
            </h1>

            <p className="hero-fade-up-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              Nexus DevOps Limited delivers professional websites, platform experiences, and dependable technical support that feel secure, modern, and memorable.
            </p>

            <div className="hero-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
              <Link href="/services" className="btn-primary">
                Explore Services
              </Link>
              <Link href="/yutok" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10">
                Try YuTok
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <HeroCard title="Fast builds" description="Responsive, conversion-focused experiences built to perform." delayClass="hero-fade-up-delay-2" />
            <HeroCard title="Reliable systems" description="MongoDB-backed content with clean administrative workflows." floating delayClass="hero-fade-up-delay-3" />
            <HeroCard title="Local support" description="Professional service for teams in Papua New Guinea and beyond." delayClass="hero-fade-up-delay-4" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300">
                Visual workflow
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                A polished digital presence that earns trust.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                We pair strong visuals, thoughtful structure, and seamless motion to create experiences that feel credible, modern, and memorable on every screen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Responsive design</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">SEO-ready structure</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Stronger engagement</span>
              </div>
            </div>

            <SlidingShow items={slideshowItems} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionTitle
          eyebrow="Core services"
          title="Professional services for modern growth"
          subtitle="We offer dependable digital solutions that help businesses present themselves clearly and operate with confidence."
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services && services.length > 0 ? (
            services.slice(0, 6).map((service) => (
              <div
                key={service._id}
                className="brand-card flex flex-col overflow-hidden transition hover:-translate-y-1"
              >
                <MediaPreview item={service} alt={service.title || "Service"} />

                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title || "Service Title"}
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    {service.shortDescription ||
                      service.description ||
                      "Service description will appear here."}
                  </p>

                  {service.link && (
                    <div className="mt-5">
                      <Link
                        href={service.link}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Learn More
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No services available yet.
            </p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="font-semibold text-emerald-600">
            View All Services
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            title="Projects Delivered"
            subtitle="Projects we delivered for our clients, showcasing our expertise and commitment to quality."
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition hover:shadow-xl"
                >
                  <MediaPreview
                    item={project}
                    alt={project.title || "Project"}
                  />

                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      {project.title || "Project Title"}
                    </h3>

                    <p className="mt-3 leading-relaxed text-slate-600">
                      {project.shortDescription ||
                        project.description ||
                        "Project description will appear here."}
                    </p>

                    {project.link && (
                      <div className="mt-5">
                        <Link
                          href={project.link}
                          className="font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          View Project
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No projects available yet. Admin can publish projects from the dashboard.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative h-[350px] w-full md:h-[420px]">
              <Image
                src="/images/project1.webp"
                alt="Professional software development"
                fill
                className="rounded-xl object-cover"
                priority
              />
            </div>

            <div className="max-w-xl">
              <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Professional Website/App Development You Can Trust
              </h2>

              <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
                Nexus DevOps Limited specializes in delivering reliable and
                scalable web and software development solutions designed for
                modern businesses and government organizations.
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                Our approach focuses on performance, usability, and strong
                system design, helping organizations improve efficiency and
                build a powerful digital presence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
