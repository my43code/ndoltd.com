import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(2,6,23,0.06)] transition hover:shadow-[0_14px_32px_rgba(16,185,129,0.16)]"
    >
      <Image
        src="/images/logo.jpg"
        alt="Nexus DevOps Logo"
        width={42}
        height={42}
        className="rounded-xl border border-emerald-500/20 object-contain"
      />

      <div className="leading-tight">
        <h1 className="text-lg font-bold tracking-wide text-slate-950 md:text-xl">
          Nexus DevOps
        </h1>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-700">
          Limited
        </p>
      </div>
    </Link>
  );
}