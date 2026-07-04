import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 
                 border-2 border-yellow-400 
                 px-3 py-2 rounded-lg
                 bg-black/40 backdrop-blur-md
                 shadow-md hover:shadow-yellow-400/30 transition"
    >
      <Image
        src="/images/logo.jpg"
        alt="Nexus DevOps Logo"
        width={42}
        height={42}
        className="rounded-md object-contain border border-yellow-400"
      />

      <div className="leading-tight">
        <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
          Nexus DevOps
        </h1>
        <p className="text-xs text-yellow-300">Limited</p>
      </div>
    </Link>
  );
}