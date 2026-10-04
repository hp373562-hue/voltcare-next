"use client";

import { useState } from "react";

export default function ServiceForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const request = {
      consumerName: data.get("consumerName"),
      consumerNumber: data.get("consumerNumber"),
      category: `Service: ${data.get("requestType")}`,
      area: data.get("area"),
      description: data.get("description"),
    };

    setMessage("Saving demo request...");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save the request.");
      }

      setMessage(`Saved! Demo reference: ${result.id}`);
      form.reset();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="mt-8 hud-panel p-6">
      <h3 className="text-xl font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-600 dark:bg-cyan-400 rounded-full animate-ping"></span>
        Other service requests
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-cyan-600 uppercase">
        These are demo requests and are not sent to MSEDCL.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Consumer name
          <input
            name="consumerName"
            required
            placeholder="Enter consumer name"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Consumer number
          <input
            name="consumerNumber"
            required
            inputMode="numeric"
            minLength={12}
            maxLength={12}
            pattern="[0-9]{12}"
            title="Enter the 12-digit consumer number"
            placeholder="12-digit consumer number"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Request type
          <select
            name="requestType"
            required
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          >
            <option value="">Choose a service</option>
            <option>New connection enquiry</option>
            <option>Meter reading request</option>
            <option>Update contact details enquiry</option>
            <option>Name or address correction enquiry</option>
            <option>Other service enquiry</option>
          </select>
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Area
          <input
            name="area"
            required
            placeholder="Your area or locality"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Details
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Add details about your request"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <button
          type="submit"
          className="w-fit rounded-xl dark:rounded-sm bg-blue-600 dark:bg-cyan-300/10 border border-blue-700 dark:border-cyan-400 px-6 py-3 font-bold text-white dark:text-cyan-400 hover:bg-blue-700 dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-colors uppercase tracking-widest dark:shadow-[0_0_10px_rgba(0,242,254,0.3)]"
        >
          Submit demo request
        </button>
      </form>

      {message && (
        <p className="mt-4 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase" role="status">
          {">"} {message}
        </p>
      )}
    </section>
  );
}