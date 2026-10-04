"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function AdminQueue() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("Loading complaints...");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/requests", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load requests.");

      const data = await response.json();
      setRequests(data);
      setMessage(data.length ? "" : "No requests have been submitted yet.");
    } catch (error) {
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function updateStatus(id, status) {
    setMessage("Updating status...");

    try {
      const response = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error("Could not update the request.");

      await loadRequests();
      setMessage("Request status updated.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const visibleRequests = useMemo(() => {
    const query = search.toLowerCase().trim();

    return requests.filter(request => {
      const matchesSearch = [
        request.id,
        request.category,
        request.area,
        request.description,
        request.consumerName,
        request.consumerNumber,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const openCount = requests.filter(
    request => request.status !== "Resolved"
  ).length;

  const resolvedCount = requests.filter(
    request => request.status === "Resolved"
  ).length;

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Complaint queue</h2>
          <p className="mt-1 text-sm text-slate-400">
            Demo requests saved by VoltCare.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total requests</p>
          <p className="mt-1 text-2xl font-bold">{requests.length}</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Open</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">{openCount}</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-300">
            {resolvedCount}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search by name, consumer number, or complaint..."
          className="rounded-lg bg-slate-800 p-3 text-sm"
        />

        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
          className="rounded-lg bg-slate-800 p-3 text-sm"
        >
          <option>All</option>
          <option>Received</option>
          <option>Under review</option>
          <option>Resolved</option>
        </select>
      </div>

      {message && (
        <p className="mt-4 text-sm text-cyan-300" role="status">
          {message}
        </p>
      )}

      <div className="mt-4 grid gap-3">
        {visibleRequests.map(complaint => (
          <article
            key={complaint.id}
            className="rounded-xl border border-white/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{complaint.category}</h3>
                  {complaint.aiPriority && (
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${complaint.aiPriority === 'Critical' ? 'bg-red-500/20 text-red-400' : complaint.aiPriority === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {complaint.aiPriority}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  Consumer: {complaint.consumerName || "—"}
                </p>
                <p className="text-sm text-slate-300">
                  Consumer number: {complaint.consumerNumber || "—"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Area: {complaint.area}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {complaint.description}
                </p>
                
                {complaint.aiSummary && (
                  <div className="mt-4 rounded-lg bg-cyan-950/40 p-3 border border-cyan-900/50">
                    <p className="text-xs font-bold text-cyan-300 mb-1">✨ AI Insights</p>
                    <p className="text-sm text-slate-300"><span className="text-slate-400">Category:</span> {complaint.aiCategory}</p>
                    <p className="text-sm text-slate-300"><span className="text-slate-400">Summary:</span> {complaint.aiSummary}</p>
                    <p className="text-sm text-slate-300 mt-2"><span className="text-slate-400">Suggested Response:</span> {complaint.aiResponse}</p>
                  </div>
                )}
                
                <p className="mt-3 text-xs text-slate-500">
                  Ref: {complaint.id}
                </p>
              </div>

              <label className="grid gap-1 text-xs text-slate-400">
                Status
                <select
                  value={complaint.status}
                  onChange={event =>
                    updateStatus(complaint.id, event.target.value)
                  }
                  className="rounded-lg bg-slate-800 p-2 text-white"
                >
                  <option>Received</option>
                  <option>Under review</option>
                  <option>Resolved</option>
                </select>
              </label>
            </div>
          </article>
        ))}

        {!message && visibleRequests.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            No requests match your search.
          </p>
        )}
      </div>
    </section>
  );
}