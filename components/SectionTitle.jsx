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
        <p className="eyebrow-pill animate-bounce-in transition-transform hover:scale-105">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl text-gradient animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {title}
      </h2>

      {subtitle ? (
        <p className={`mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg animate-fade-in-up ${isLeftAligned ? "" : "mx-auto"}`} style={{ animationDelay: "0.2s" }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
