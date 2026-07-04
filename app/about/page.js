import Link from "next/link";
import { ArrowRight, BadgeCheck, Layers3, Sparkles, Users2 } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import PostCard from "@/components/PostCard";
import MediaFrame from "@/components/MediaFrame";
import { getSiteAbout } from "@/lib/siteContent";
import { connectMongoDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Post from "@/models/Post";
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

async function getPosts() {
  try {
    await connectMongoDB();
    return await Post.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load posts:", error);
    }
    return [];
  }
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-xl hover:border-emerald-400/50 hover:bg-white/12 transition-all duration-300 card-hover animate-fade-in-up glow-pulse">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200 hover:scale-110 transition hover:shadow-lg hover:shadow-emerald-500/30">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-black text-white text-gradient">{value}</p>
        </div>
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p> : null}
    </div>
  );
}

function SectionCard({ title, description, accent = "emerald" }) {
  const accentStyles =
    accent === "emerald"
      ? "from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-700"
      : "from-sky-500/20 via-sky-500/10 to-transparent text-sky-700";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition-all duration-300 card-hover animate-fade-in-up hover:border-emerald-300/50">
      <div className={`inline-flex rounded-full bg-gradient-to-r px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] ${accentStyles} animate-bounce-in`}>
        {title}
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
        {description}
      </p>
    </div>
  );
}

function ValueChip({ value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 animate-fade-in-up link-hover">
      <BadgeCheck size={15} className="text-emerald-600" />
      {value}
    </span>
  );
}

function ProjectCard({ project }) {
  const mediaType = project?.video ? "video" : "image";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] card-hover animate-fade-in-up hover:border-emerald-300/50">
      <MediaFrame
        image={project?.image}
        video={project?.video}
        alt={project?.title || "Project"}
        className="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 33vw"
        overlay
      />

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
          {mediaType === "video" ? "Video showcase" : "Featured work"}
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          {project?.title || "Project title"}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          {project?.description || project?.shortDescription || "Project details will appear here."}
        </p>

        {project?.link ? (
          <a
            href={project.link}
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={project.link.startsWith("http") ? "noreferrer" : undefined}
            className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            View project
            <ArrowRight size={16} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function TeamCard({ member }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      {member?.image || member?.video ? (
        <MediaFrame
          image={member.image}
          video={member.video}
          alt={member?.name || "Team member"}
          className="aspect-[4/5]"
          sizes="(max-width: 768px) 100vw, 25vw"
          overlay
        />
      ) : (
        <div className="flex aspect-[4/5] items-end bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-900 p-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-200">
              Team
            </p>
            <h3 className="mt-3 text-2xl font-bold">{member?.name || "Team member"}</h3>
            <p className="mt-2 text-sm text-slate-300">{member?.role || "Role"}</p>
          </div>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-950">{member?.name || "Team member"}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{member?.role || "Role"}</p>
      </div>
    </article>
  );
}

export default async function AboutPage() {
  const [about, services, projects, posts] = await Promise.all([
    getSiteAbout(),
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const projectShowcase = (about.projects && about.projects.length > 0
    ? about.projects
    : projects
  ).slice(0, 6);
  const serviceShowcase = services.slice(0, 3);
  const postShowcase = posts.slice(0, 3);
  const heroMedia = about.history?.video || about.history?.image || about.mvv?.video || about.mvv?.image || serviceShowcase[0]?.video || serviceShowcase[0]?.image || "/images/project1.webp";
  const heroIsVideo = Boolean(about.history?.video || about.mvv?.video || serviceShowcase[0]?.video);
  const heroText =
    about.history?.text ||
    about.mission ||
    about.contact?.tagline ||
    "A focused team turning design, engineering, and operations into dependable digital experiences.";
  const contact = about.contact || {};

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.12),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.1),transparent_20%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.72)_50%,rgba(6,78,59,0.48)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="max-w-2xl">
            <span className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 backdrop-blur">
              <Sparkles size={16} />
              About Nexus DevOps Limited
            </span>

            <h1 className="hero-fade-up-delay-1 mt-6 text-5xl font-black tracking-tight md:text-7xl">
              We build digital systems that look premium and perform cleanly.
            </h1>

            <p className="hero-fade-up-delay-2 mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              {heroText}
            </p>

            <div className="hero-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                View services
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <div className="hero-fade-up-delay-4 relative">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
              {heroIsVideo ? (
                <MediaFrame
                  video={heroMedia}
                  alt="About page hero"
                  className="min-h-[420px]"
                  overlay
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              ) : (
                <MediaFrame
                  image={heroMedia}
                  alt="About page hero"
                  className="min-h-[420px]"
                  overlay
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              )}

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200">
                      Company line
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {contact.tagline || "Digital solutions that feel intentional and reliable."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/5 p-3 text-center">
                      <p className="text-2xl font-black">{services.length}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                        Services
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 text-center">
                      <p className="text-2xl font-black">{projectShowcase.length}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                        Projects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Layers3}
            label="Services"
            value={services.length}
            detail="Live offerings pulled from MongoDB and styled for quick scanning."
          />
          <StatCard
            icon={Users2}
            label="Team"
            value={about.team.length}
            detail="Add team members in the About document when you are ready to showcase them."
          />
          <StatCard
            icon={Sparkles}
            label="Projects"
            value={projectShowcase.length}
            detail="Project cards and media are rendered directly from stored content."
          />
          <StatCard
            icon={BadgeCheck}
            label="Updates"
            value={posts.length}
            detail="Fresh posts appear here without any hardcoded copy in the page."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Story"
          title="Our story and operating rhythm"
          subtitle="Read about our journey and how we operate."
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
              Short history
            </p>
            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600 md:text-base">
              {about.history?.text ||
                "Use the admin dashboard to add the company history. Once stored, it will appear here with the same premium layout."}
            </p>

            {about.values.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {about.values.map((value, index) => (
                  <ValueChip key={`${value}-${index}`} value={value} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                Add company values from the admin dashboard to highlight your
                principles here.
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SectionCard
              title="Mission"
              description={
                about.mission ||
                "Define the mission in the admin dashboard to show your purpose, outcomes, and commitment here."
              }
              accent="emerald"
            />
            <SectionCard
              title="Vision"
              description={
                about.vision ||
                "Define the vision in the admin dashboard to explain where the company is heading next."
              }
              accent="sky"
            />
            <div className="sm:col-span-2 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-7 text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                Contact profile
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {contact.companyName || "Nexus DevOps Limited"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {contact.address || "Add your office address in the About document."}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  {contact.email ? <p>{contact.email}</p> : null}
                  {contact.phone ? <p>{contact.phone}</p> : null}
                  {contact.hours ? <p>{contact.hours}</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {about.team.length > 0 ? (
        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="People"
              title="Leadership and team"
              subtitle="When team members are stored in MongoDB, they are presented here as polished profile cards."
            />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {about.team.map((member) => (
                <TeamCard key={member._id || member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Services"
          title="A sample of the services currently published"
          subtitle="Reliable services we offer for your information technology needs."
        />

        {serviceShowcase.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {serviceShowcase.map((service) => (
              <ServiceCard key={service._id} service={service}/>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No services are published yet.
          </div>
        )}
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Projects"
            title="Selected work and delivered ideas"
            subtitle="Delivered solutions that have made a real impact for our clients."
          />

          {projectShowcase.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {projectShowcase.slice(0, 3).map((project) => (
                <ProjectCard key={project._id || project.title} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No project showcases are available yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Updates"
            title="Recent updates and published stories"
            subtitle="The latest posts from the updates collection are displayed here in a more editorial format."
          />

          {postShowcase.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {postShowcase.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No updates have been published yet.
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                Contact us
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Need a polished digital presence next?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-lg">
                Reach out through the contact page and we will use the information
                stored in MongoDB to keep your support and office details current.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300">
              {contact.email ? <p>{contact.email}</p> : null}
              {contact.phone ? <p>{contact.phone}</p> : null}
              <p>{contact.address || "Add your contact address in the admin dashboard."}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Open contact page
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
