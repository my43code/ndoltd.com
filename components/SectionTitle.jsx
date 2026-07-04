export default function SectionTitle({
  title,
  subtitle,
  eyebrow,
  align = "center",
}) {
  const isLeftAligned = align === "left";

  return (
    <div
      className={`mb-12 max-w-4xl ${isLeftAligned ? "text-left" : "mx-auto text-center"} animate-fade-in-up`}
    >
      {eyebrow ? (
        <p className="inline-flex rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700 animate-bounce-in hover:scale-105 transition-transform">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl text-gradient animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {title}
      </h2>

      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
