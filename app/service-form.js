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
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h3 className="text-lg font-bold">Other service requests</h3>
      <p className="mt-1 text-sm text-slate-400">
        These are demo requests and are not sent to MSEDCL.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          Consumer name
          <input
            name="consumerName"
            required
            placeholder="Enter consumer name"
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <label className="grid gap-2 text-sm">
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
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <label className="grid gap-2 text-sm">
          Request type
          <select
            name="requestType"
            required
            className="rounded-lg bg-slate-800 p-3"
          >
            <option value="">Choose a service</option>
            <option>New connection enquiry</option>
            <option>Meter reading request</option>
            <option>Update contact details enquiry</option>
            <option>Name or address correction enquiry</option>
            <option>Other service enquiry</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Area
          <input
            name="area"
            required
            placeholder="Your area or locality"
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <label className="grid gap-2 text-sm">
          Details
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Add details about your request"
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <button
          type="submit"
          className="w-fit rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950"
        >
          Submit demo request
        </button>
      </form>

      <p role="status" className="mt-4 text-sm text-cyan-300">
        {message}
      </p>
    </section>
  );
}