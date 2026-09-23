"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Signing in...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not sign in.");
      }

      window.location.href = "/admin";
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#080d18] p-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">VoltCare admin sign in</h1>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            Admin username
            <input
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
              required
              className="rounded-lg bg-slate-800 p-3"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Admin password
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
              className="rounded-lg bg-slate-800 p-3"
            />
          </label>

          <button className="rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950">
            Sign in
          </button>
        </form>

        <p role="status" className="mt-4 text-sm text-cyan-300">
          {message}
        </p>
      </section>
    </main>
  );
}