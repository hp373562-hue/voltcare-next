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
    <main className="min-h-screen bg-[#080d18] grid place-items-center p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-cyan-300 text-2xl text-slate-950">
            s
          </div>
          <h1 className="text-2xl font-bold">VoltCare</h1>
          <p className="text-slate-400 mt-2">
            {isLogin ? "Sign in to manage your account" : "Create an account"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm outline-none focus:border-cyan-300"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400">12-Digit Consumer Number</label>
            <input
              type="text"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm outline-none focus:border-cyan-300"
              maxLength={12}
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm outline-none focus:border-cyan-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-xl bg-cyan-300 py-3 font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-cyan-300 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
