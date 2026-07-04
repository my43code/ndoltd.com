"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Bot, User } from "lucide-react";

export default function YuTokPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I am YuTok. Ask me about Nexus DevOps Limited, services, projects, or general technology questions.",
    },
  ]);

  async function handleSend(e) {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/yutok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply || "YuTok could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error("YuTok error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "There was an error connecting to YuTok.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">YuTok AI Assistant</h1>
            <p className="text-slate-400 mt-2">
              A smart assistant experience for Nexus DevOps Limited.
            </p>
          </div>

          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[70vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 flex gap-3 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  <div className="mt-1">
                    {message.role === "user" ? (
                      <User size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>
                  <p className="text-sm leading-6">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 rounded-2xl px-4 py-3">
                  YuTok is typing...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 p-4 flex gap-3"
          >
            <input
              type="text"
              placeholder="Ask YuTok something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 outline-none border border-slate-700"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 transition rounded-xl px-5 py-3 flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}