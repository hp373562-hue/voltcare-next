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
      <h3 className="text-xl font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-widest">Register a complaint</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-cyan-600 uppercase">
        Our AI will analyze your request for faster processing.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Consumer name
          <input
            name="consumerName"
            required
            defaultValue={defaultName}
            placeholder="Enter consumer name"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
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
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Complaint type
          <select
            name="category"
            required
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          >
            <option value="">Choose one</option>
            <option>Power failure</option>
            <option>Billing issue</option>
            <option>Meter issue</option>
            <option>Voltage fluctuation</option>
            <option>Other</option>
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
          Describe the issue
          <textarea
            name="description"
            required
            rows={4}
            placeholder="What happened?"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:shadow-md dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-lg dark:rounded-none"
          />
        </label>

        <label className="grid gap-2 text-xs text-slate-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
          Upload a photo of the fault (Optional)
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-300 dark:border-cyan-500/30 p-2 text-slate-800 dark:text-cyan-100 rounded-lg dark:rounded-none file:mr-4 file:rounded-lg dark:file:rounded-sm file:border-0 file:bg-blue-100 dark:file:bg-cyan-500/20 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 dark:file:text-cyan-400 hover:file:bg-blue-200 dark:hover:file:bg-cyan-500/40 transition-all"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit rounded-xl dark:rounded-sm bg-blue-600 dark:bg-cyan-300/10 border border-blue-700 dark:border-cyan-400 px-6 py-3 font-bold text-white dark:text-cyan-400 hover:bg-blue-700 dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-colors uppercase tracking-widest dark:shadow-[0_0_10px_rgba(0,242,254,0.3)] disabled:opacity-50"
        >
          {isSubmitting ? "Analyzing..." : "Submit Complaint"}
        </button>
      </form>

      <p role="status" className="mt-4 text-sm text-emerald-600 dark:text-cyan-300 font-bold">
        {message}
      </p>
    </section>
  );
}