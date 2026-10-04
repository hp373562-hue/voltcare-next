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
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h3 className="text-lg font-bold">Register a complaint</h3>
      <p className="mt-1 text-sm text-slate-400">
        Our AI will analyze your request for faster processing.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          Consumer name
          <input
            name="consumerName"
            required
            defaultValue={defaultName}
            placeholder="Enter consumer name"
            className="rounded-lg bg-slate-800 p-3"
          />
        </label>

        <label className="grid gap-2 text-sm">
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