import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
  const {
    title = "Service",
    description = "",
    shortDescription = "",
    image = "/images/project1.webp",
    video,
    link = "",
  } = service || {};

  const mediaSrc = video || image;
  const isVideo = Boolean(video);
  const hasLink = typeof link === "string" && link.trim().length > 0;
  const isExternalLink = hasLink && /^https?:\/\//i.test(link);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] card-hover animate-fade-in-up hover:border-emerald-300/50">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 transition-transform duration-700 group-hover:scale-[1.01] image-shadow">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 dynamic-image"
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={mediaSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="dynamic-image object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect fill='%231e293b' width='400' height='250'/%3E%3C/svg%3E"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/20 to-transparent group-hover:from-slate-950/95 transition duration-500" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur animate-bounce-in">
          {isVideo ? "Video" : "Visual"}
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200 animate-slide-in-up">
            Service
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            {title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-7 text-slate-600 md:text-base animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {shortDescription || description || "No description available."}
        </p>

        {hasLink ? (
          <div className="mt-auto pt-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {isExternalLink ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:translate-x-1 link-hover"
              >
                Explore this service
                <span aria-hidden="true" className="group-hover:translate-x-1 transition">&rarr;</span>
              </a>
            ) : (
              <Link
                href={link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:translate-x-1 link-hover"
              >
                Explore this service
                <span aria-hidden="true" className="group-hover:translate-x-1 transition">&rarr;</span>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
