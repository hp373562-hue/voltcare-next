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
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h3 className="text-lg font-bold">Track a complaint</h3>
      <p className="mt-1 text-sm text-slate-400">
        Enter the reference ID shown after submitting your demo complaint.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex flex-wrap gap-3">
        <input
          value={reference}
          onChange={event => setReference(event.target.value)}
          required
          placeholder="Paste your reference ID"
          className="min-w-0 flex-1 rounded-lg bg-slate-800 p-3"
        />
        <button className="rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950">
          Track
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-cyan-300" role="status">
          {message}
        </p>
      )}

      {complaint && (
        <article className="mt-4 rounded-xl border border-white/10 p-4">
          <p className="font-semibold">{complaint.category}</p>
          <p className="mt-3 text-sm">
            Status: <strong className="text-cyan-300">{complaint.status}</strong>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Reference: {complaint.id}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Submitted: {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </article>
      )}
    </section>
  );
}           