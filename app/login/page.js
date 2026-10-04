"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsumerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin ? "/api/consumer/login" : "/api/consumer/signup";
    const body = isLogin ? { consumerNumber, password } : { name, consumerNumber, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#05070e] grid place-items-center p-4 text-slate-800 dark:text-white bg-grid cyber-font relative overflow-hidden transition-colors duration-300">
      <div className="scanline"></div>
      <div className="hidden dark:block fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.05),transparent_70%)]"></div>
      
      <div className="w-full max-w-md hud-panel p-8 relative z-10 shadow-2xl shadow-blue-900/5 dark:shadow-none bg-white">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 grid size-24 place-items-center rounded-2xl dark:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-400 dark:to-blue-600 shadow-xl shadow-blue-600/20 dark:shadow-[0_0_30px_rgba(0,242,254,0.6)] border-2 border-blue-500 dark:border-cyan-300">
            <svg className="size-14 text-white dark:text-slate-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.22 1.75-.61 2.51l2.47 1.43C21.57 14.74 22 13.43 22 12c0-5.16-3.92-9.42-8.9-9.95zM11 2.05C6.08 2.58 2.16 6.84 2.16 12c0 1.43.43 2.74 1.14 3.94l2.47-1.43C5.38 13.75 5.16 12.9 5.16 12c0-3.53 2.61-6.43 6-6.92V2.05zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-1 7.5L8.5 12h2.5V9.5l2.5 2.5h-2.5v2.5z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-orange-500 dark:from-cyan-300 dark:to-blue-500 uppercase drop-shadow-sm">VoltCare</h1>
          <p className="text-slate-500 dark:text-cyan-600 mt-3 text-xs uppercase tracking-widest font-bold">
            {isLogin ? "Authenticate to access portal" : "Initialize new consumer account"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl dark:rounded-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 text-center shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <label className="grid gap-2 text-xs text-slate-700 dark:text-cyan-400 uppercase tracking-widest font-bold">
              Registered Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-200 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:bg-white focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-xl dark:rounded-none"
                required
              />
            </label>
          )}

          <label className="grid gap-2 text-xs text-slate-700 dark:text-cyan-400 uppercase tracking-widest font-bold">
            Consumer Number (ID)
            <input
              type="text"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-200 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:bg-white focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-xl dark:rounded-none"
              maxLength={12}
              required
            />
          </label>

          <label className="grid gap-2 text-xs text-slate-700 dark:text-cyan-400 uppercase tracking-widest font-bold">
            Access Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-50 dark:bg-cyan-950/20 border border-slate-200 dark:border-cyan-500/30 p-3 text-slate-800 dark:text-cyan-100 outline-none focus:bg-white focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all rounded-xl dark:rounded-none"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl dark:rounded-sm bg-gradient-to-r from-blue-600 to-blue-700 dark:from-cyan-300/10 dark:to-cyan-300/10 border-0 dark:border dark:border-cyan-400 px-6 py-4 font-bold text-white dark:text-cyan-400 hover:from-blue-700 hover:to-blue-800 dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all shadow-lg shadow-blue-600/20 dark:shadow-[0_0_10px_rgba(0,242,254,0.3)] uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Synchronizing..." : isLogin ? "Establish Link" : "Register Node"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-slate-500 dark:text-cyan-600 uppercase tracking-widest">
          {isLogin ? "Unregistered node?" : "Already verified?"}{" "}
          <button
            onClick={() => {
               setIsLogin(!isLogin);
               setError("");
            }}
            className="text-orange-600 dark:text-cyan-300 hover:text-orange-700 dark:hover:text-white underline underline-offset-4 ml-1 transition-colors"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
