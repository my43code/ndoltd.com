export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import SlidingShow from "@/components/SlidingShow";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";

async function getPosts() {
  try {
    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return { posts };
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load posts:", error);
    }
    return { posts: [] };
  }
}

function FeedCard({ post, label }) {
  const teaser = post?.summary?.slice(0, 90) || "A fresh update from our team.";

  return (
    <Link
      href={`/updates/${post.slug || post._id}`}
      className="group block min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label={`Read latest feed item: ${post.title}`}
    >
      <div className="grid min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,96px)_1fr] sm:p-5 lg:grid-cols-[minmax(0,128px)_1fr] lg:p-6">
        <div className="relative h-44 overflow-hidden rounded-[1.75rem] bg-slate-900 transition-transform duration-500 group-hover:scale-105 image-shadow sm:h-28 sm:w-28 sm:rounded-3xl lg:h-32 lg:w-32">
          <Image
            src={post.image || "/images/project1.webp"}
            alt={post.title}
            fill
            className="dynamic-image object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 110px, 128px"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 110 110'%3E%3Crect fill='%231e293b' width='110' height='110'/%3E%3C/svg%3E"
          />
        </div>

        <div className="min-w-0 flex flex-col justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.38em] text-emerald-700">
            {label}
          </span>
          <h3 className="text-base font-semibold leading-6 text-slate-950 transition-colors duration-300 group-hover:text-emerald-700 truncate">
            {post.title}
          </h3>
          <p className="text-sm leading-6 text-slate-500 overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-3">
            {teaser}{teaser.length === 90 ? "..." : ""}
          </p>
          <span className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-900">
            View update
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function UpdatesPage() {
  const data = await getPosts();
  const posts = data?.posts || [];
  const featuredPost = posts[0] || null;
  const feedPosts = posts.slice(1);

  const readingTime = (post) =>
    Math.max(1, Math.ceil(((post?.content || post?.summary || "").length || 240) / 900));

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-6">
        <section className="mb-10 overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.5)] md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">
                Updates & stories
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Fresh stories, polished presentation, and a clearer view of what we are building.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Browse the latest updates and let the visuals do the storytelling with a modern, cinematic flow that matches the rest of the site.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  Recent highlights
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  SEO-friendly stories
                </span>
              </div>
            </div>

            <SlidingShow
              items={posts.slice(0, 3).map((post, index) => ({
                id: String(post._id || index + 1),
                title: post.title,
                subtitle: post.summary || post.content?.slice(0, 140),
                image: post.image || "/images/project1.webp",
                badge: index === 0 ? "Featured" : index === 1 ? "Latest" : "Insight",
              }))}
            />
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <article className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 text-white shadow-[0_35px_70px_-35px_rgba(15,23,42,0.4)] transition-all duration-500 hover:-translate-y-0.5">
            {featuredPost ? (
              <>
                <div className="relative min-h-[300px] sm:min-h-[420px] overflow-hidden rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.01]">
                  <Image
                    src={featuredPost.image || "/images/project1.webp"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 560'%3E%3Crect fill='%2310232f' width='800' height='560'/%3E%3C/svg%3E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
                </div>

                <div className="relative p-8 md:p-12">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                    Featured
                  </span>
                  <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
                    {featuredPost.title}
                  </h1>
                  <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                    {featuredPost.summary || "A standout story from our update feed, highlighting the latest news and insights from our team."}
                  </p>

                  <div className="mt-10 flex flex-col gap-5 border-t border-slate-800/80 pt-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-sm font-bold text-white">
                        ND
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">ndoltd developers</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {`${readingTime(featuredPost)} min read`}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/updates/${featuredPost.slug || featuredPost._id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Read post
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid min-h-[420px] place-items-center rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-center">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                    Featured
                  </span>
                  <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                    Updates are coming soon
                  </h1>
                  <p className="mt-6 text-base leading-8 text-slate-300 md:text-lg">
                    We’re preparing the first story for this section. Check back later for editorial updates, insights, and highlights from our team.
                  </p>
                </div>
              </div>
            )}
          </article>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.12)] md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                    Fresh
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    The Latest Feed
                  </h2>
                </div>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  New
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {feedPosts.length > 0 ? (
                  feedPosts.map((post, index) => (
                    <FeedCard key={post._id} post={post} label={index === 0 ? "Latest" : "Valuable"} />
                  ))
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    No recent feed items to display.
                  </div>
                )}
              </div>
            </section>

            <SectionTitle
              eyebrow="Curated Gems"
              title="Deep Dives & Insights"
              subtitle="Explore thoughtful analysis, trend reports, and the ideas shaping our work. Every story is selected to help you discover something meaningful."
              align="left"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
