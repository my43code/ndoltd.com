import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-32 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* ✅ LEFT CONTENT */}
        <div className="animate-fade-in-left">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm mb-6 border border-yellow-400/30 animate-fade-in-up hover:scale-105 transition-transform duration-300 hover:bg-yellow-400/30">
            Web Development • IT Support • Digital Solutions
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Building <span className="text-gradient bg-gradient-to-r from-emerald-300 via-emerald-400 to-yellow-300 bg-clip-text text-transparent animate-pulse">Smart Technology</span> Solutions for PNG Businesses
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Nexus DevOps Limited delivers professional websites, digital systems,
            database-driven platforms, and IT support for modern organizations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/services"
              className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-full font-medium transition shadow-lg hover:shadow-emerald-500/50 hover:scale-110 hover:shadow-lg btn-glow duration-300"
            >
              Explore Services
            </Link>

            <Link
              href="/contact"
              className="border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-full font-medium transition hover:shadow-lg hover:scale-110 link-hover duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* ✅ RIGHT IMAGE */}
        <div className="relative animate-fade-in-right">
          <Image
            src="/images/hero-tech.jpg"
            alt="Nexus DevOps Technology"
            width={700}
            height={500}
            className="rounded-2xl shadow-2xl w-full h-auto object-cover border border-yellow-400/30 hover:scale-105 transition-transform duration-500 animate-subtle-bounce"
            loading="eager"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 500'%3E%3Crect fill='%230f172a' width='700' height='500'/%3E%3C/svg%3E"
          />

          {/* ✅ GLOW EFFECT */}
          <div className="absolute -inset-1 bg-yellow-400/10 blur-2xl rounded-2xl -z-10 glow-pulse"></div>
        </div>

      </div>
    </section> 
  );
}