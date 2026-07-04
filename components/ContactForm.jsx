"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, SendHorizonal } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus({
        type: "success",
        message: "Message sent successfully. We will get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 card-hover animate-scale-in hover:border-emerald-300/50"
    >
      <div className="mb-6 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700 animate-bounce-in">
          Start a conversation
        </p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl text-gradient animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Tell us what you are building.
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          We read every message carefully and usually respond within one business day.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <label className="block group">
          <span className="mb-2 block text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition">
            Your name
          </span>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-emerald-300/50 input-focus"
            required
          />
        </label>

        <label className="block group">
          <span className="mb-2 block text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition">
            Email address
          </span>
          <input
            type="email"
            name="email"
            placeholder="info@company.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-emerald-300/50 input-focus"
            required
          />
        </label>
      </div>

      <label className="mt-4 block group animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
        <span className="mb-2 block text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition">
          Subject
        </span>
        <input
          type="text"
          name="subject"
          placeholder="Project inquiry, support request, partnership..."
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-emerald-300/50 input-focus"
          required
        />
      </label>

      <label className="mt-4 block group animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <span className="mb-2 block text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition">
          Message
        </span>
        <textarea
          name="message"
          placeholder="Describe your goals, timeline, and any important details."
          value={form.message}
          onChange={handleChange}
          className="min-h-[170px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 hover:border-emerald-300/50 input-focus"
          required
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-950/50 disabled:cursor-not-allowed disabled:opacity-70 hover:scale-105 btn-glow"
        >
          {loading ? "Sending..." : "Send Message"}
          <SendHorizonal size={16} className={loading ? "animate-slow-rotate" : ""} />
        </button>

        {status.message ? (
          <p
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium animate-bounce-in ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
            aria-live="polite"
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} className="animate-spin" />
            ) : (
              <AlertCircle size={16} className="animate-pulse" />
            )}
            {status.message}
          </p>
        ) : (
          <p className="text-sm text-slate-500 animate-fade-in">
            All messages are saved securely and handled by our team.
          </p>
        )}
      </div>
    </form>
  );
}
