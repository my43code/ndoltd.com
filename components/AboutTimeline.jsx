export default function AboutTimeline({ items }) {
    return (
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={item.year}
            className="border-l-4 border-emerald-600 pl-5 py-2 bg-white rounded-r-xl shadow-sm hover:shadow-md transition hover:border-emerald-400 card-hover animate-fade-in-left group"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <p className="text-emerald-700 font-bold text-sm uppercase tracking-widest glow-text group-hover:scale-110 transition">{item.year}</p>
            <h3 className="text-xl font-semibold text-slate-900 text-gradient mt-1 group-hover:translate-x-1 transition">{item.title}</h3>
            <p className="mt-2 text-slate-600 leading-relaxed group-hover:text-slate-700 transition">{item.description}</p>
          </div>
        ))}
      </div>
    );
  }
  