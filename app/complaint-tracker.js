"use client";

import { useState } from "react";

export default function ComplaintTracker() {
  const [reference, setReference] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    setComplaint(null);
    setMessage("Looking up your complaint...");

    try {
      const response = await fetch(
        `/api/requests?id=${encodeURIComponent(reference.trim())}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not find that complaint.");
      }

      setComplaint(result);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="mt-8 hud-panel p-6">
      <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
        Track a complaint
      </h3>
      <p className="mt-1 text-xs text-cyan-600 uppercase">
        Enter the reference ID shown after submitting your demo complaint.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex flex-wrap gap-3">
        <input
          value={reference}
          onChange={event => setReference(event.target.value)}
          required
          placeholder="Paste your reference ID"
          className="min-w-0 flex-1 bg-cyan-950/20 border border-cyan-500/30 p-3 text-cyan-100 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all uppercase"
        />
        <button className="rounded-r-xl bg-cyan-300/10 border border-cyan-400 px-6 py-3 font-bold text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-colors uppercase tracking-widest shadow-[0_0_10px_rgba(0,242,254,0.3)]">
          Track
        </button>
      </form>

      {message && (
        <p className="mt-4 text-xs font-bold text-cyan-400 uppercase" role="status">
          > {message}
        </p>
      )}

      {complaint && (
        <article className="mt-6 border border-cyan-500/30 bg-cyan-950/30 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
          <p className="font-bold text-cyan-300 uppercase tracking-widest">{complaint.category}</p>
          <p className="mt-3 text-sm text-cyan-100 uppercase">
            Status: <strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,242,254,0.8)]">{complaint.status}</strong>
          </p>
          <p className="mt-2 text-xs text-cyan-600 font-mono">
            REF: {complaint.id}
          </p>
          <p className="mt-1 text-xs text-cyan-600 font-mono">
            SYS_TIME: {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </article>
      )}
    </section>
  );
}           