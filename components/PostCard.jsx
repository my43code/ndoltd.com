import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
  const postedAt = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const readingTime = Math.max(
    1,
    Math.ceil(((post?.content || post?.summary || "").length || 240) / 900)
  );

  return (
    <Link
      href={`/updates/${post.slug || post._id}`}
      className="group block h-full cursor-pointer"
      aria-label={`Read full story: ${post.title}`}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)] card-hover animate-fade-in-up hover:border-emerald-300/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 transition-transform duration-700 will-change-transform group-hover:scale-[1.01] image-shadow">
          <Image
            src={post.image || "/images/project1.webp"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="dynamic-image object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent group-hover:from-slate-950/95 transition duration-500" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 animate-fade-in-up">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur animate-bounce-in">
              Update
            </span>

            <div className="text-right text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 animate-slide-in-right">
              <p>{postedAt}</p>
              <p>{readingTime} min read</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-950 md:text-2xl animate-fade-in-up">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {post.summary}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <span className="text-sm font-semibold text-emerald-700 group-hover:translate-x-1 transition link-hover">
              Read story
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Editorial
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
