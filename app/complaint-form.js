"use client";

import { useState } from "react";

export default function ComplaintForm({ defaultName = "", defaultNumber = "" }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Analyzing your complaint with AI...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    let base64Image = null;
    let mimeType = null;
    const file = formData.get("photo");
    
    if (file && file.size > 0) {
      const reader = new FileReader();
      base64Image = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      mimeType = file.type;
    }

    const complaint = {
      consumerName: formData.get("consumerName"),
      consumerNumber: formData.get("consumerNumber"),
      category: formData.get("category"),
      area: formData.get("area"),
      description: formData.get("description"),
      photoBase64: base64Image,
      photoMimeType: mimeType,
    };

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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 hud-panel p-6">
      <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-widest">Register a complaint</h3>
      <p className="mt-1 text-xs text-cyan-600 uppercase">
        Our AI will analyze your request for faster processing.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <label className="grid gap-2 text-xs text-cyan-400 uppercase tracking-widest">
          Consumer name
          <input
            name="consumerName"
            required
            defaultValue={defaultName}
            placeholder="Enter consumer name"
            className="bg-cyan-950/20 border border-cyan-500/30 p-3 text-cyan-100 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all"
          />
        </label>

        <label className="grid gap-2 text-xs text-cyan-400 uppercase tracking-widest">
          Consumer number
          <input
            name="consumerNumber"
            required
            defaultValue={defaultNumber}
            inputMode="numeric"
            minLength={12}
            maxLength={12}
            pattern="[0-9]{12}"
            title="Enter the 12-digit consumer number"
            placeholder="12-digit consumer number"
            className="bg-cyan-950/20 border border-cyan-500/30 p-3 text-cyan-100 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all"
          />
        </label>

        <label className="grid gap-2 text-xs text-cyan-400 uppercase tracking-widest">
          Complaint type
          <select
            name="category"
            required
            className="bg-cyan-950/20 border border-cyan-500/30 p-3 text-cyan-100 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all"
          >
            <option value="">Choose one</option>
            <option>Power failure</option>
            <option>Billing issue</option>
            <option>Meter issue</option>
            <option>Voltage fluctuation</option>
            <option>Other</option>
          </select>
        </label>

        <label className="grid gap-2 text-xs text-cyan-400 uppercase tracking-widest">
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

        <label className="grid gap-2 text-sm">
          Upload a photo of the fault (Optional)
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="rounded-lg bg-slate-800 p-2 text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-950"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"
        >
          {isSubmitting ? "Analyzing..." : "Submit Complaint"}
        </button>
      </form>

      <p role="status" className="mt-4 text-sm text-cyan-300">
        {message}
      </p>
    </section>
  );
}