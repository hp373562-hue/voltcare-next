"use client";

import { useState } from "react";

export default function ComplaintForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const complaint = {
      consumerName: formData.get("consumerName"),
      consumerNumber: formData.get("consumerNumber"),
      category: formData.get("category"),
      area: formData.get("area"),
      description: formData.get("description"),
    };

    setMessage("Saving demo complaint...");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save the complaint.");
      }

      setMessage(`Saved! Demo reference: ${result.id}`);
      form.reset();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h3 className="text-lg font-bold">Register a complaint</h3>
      <p className="mt-1 text-sm text-slate-400">
        This is a demo form; it does not contact MSEDCL.
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
          Complaint type
          <select
            name="category"
            required
            className="rounded-lg bg-slate-800 p-3"
          >
            <option value="">Choose one</option>
            <option>Power failure</option>
            <option>Billing issue</option>
            <option>Meter issue</option>
            <option>Voltage fluctuation</option>
            <option>Other</option>
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
          Describe the issue
          <textarea
            name="description"
            required
            rows={4}
            placeholder="What happened?"
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <button
          type="submit"
          className="w-fit rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950"
        >
          Submit demo complaint
        </button>
      </form>

      <p role="status" className="mt-4 text-sm text-cyan-300">
        {message}
      </p>
    </section>
  );
}