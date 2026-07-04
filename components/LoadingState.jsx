"use client";

export default function LoadingState({
  eyebrow = "Loading",
  title = "Fetching the latest content",
  subtitle = "Please wait while we load the newest data from the database.",
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16"> 
      <div className="max-w-3xl space-y-4">
        <p className="inline-flex rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
          {eyebrow}
        </p>
        <div className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          {title}
        </div>
        <div className="h-14 w-3/4 rounded-3xl bg-slate-200/80" />
        <div className="h-5 w-full max-w-2xl rounded-full bg-slate-200/70" />
        <div className="h-5 w-5/6 rounded-full bg-slate-200/70" />
        <p className="max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="h-56 animate-pulse bg-slate-200/80" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-24 rounded-full bg-slate-200/80" />
              <div className="h-7 w-5/6 rounded-full bg-slate-200/80" />
              <div className="h-4 w-full rounded-full bg-slate-200/70" />
              <div className="h-4 w-2/3 rounded-full bg-slate-200/70" />
              <div className="h-4 w-32 rounded-full bg-slate-200/80" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[360px] animate-pulse rounded-[2rem] bg-slate-200/80" />
        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="h-4 w-32 rounded-full bg-slate-200/80" />
          <div className="h-10 w-2/3 rounded-full bg-slate-200/80" />
          <div className="h-4 w-full rounded-full bg-slate-200/70" />
          <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
          <div className="h-4 w-4/5 rounded-full bg-slate-200/70" />
          <div className="mt-8 h-12 w-full rounded-2xl bg-slate-200/80" />
          <div className="h-12 w-3/4 rounded-2xl bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}
