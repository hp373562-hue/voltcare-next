"use client";

import { useState } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you with your VoltCare account today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Sorry, I am having trouble right now." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl shadow-cyan-900/20">
          <div className="flex items-center justify-between bg-cyan-300 p-4 text-slate-950">
            <h3 className="font-bold">VoltCare Support</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-900 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="flex h-80 flex-col gap-3 overflow-y-auto p-4 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-xl p-3 ${
                  msg.role === "user"
                    ? "self-end bg-cyan-300 text-slate-950"
                    : "self-start bg-slate-800 text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-xl bg-slate-800 p-3 text-slate-400">
                Typing...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex border-t border-white/10 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-l-xl bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-r-xl bg-cyan-300 px-4 font-bold text-slate-950"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="grid size-14 place-items-center rounded-full bg-cyan-300 text-2xl shadow-lg shadow-cyan-900/40 transition-transform hover:scale-105"
        >
          💬
        </button>
      )}
    </div>
  );
}
