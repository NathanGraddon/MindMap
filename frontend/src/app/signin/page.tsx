"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Redirect home after successful login
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-md mx-auto bg-[#0b1020] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-neutral-400 mb-6">
          Sign in to view your decision history and personalized dashboard.
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/60"
              placeholder="you@udel.edu"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/60"
              placeholder="••••••••"
              type="password"
              required
            />

            <div className="mt-2 flex items-center justify-between">
              <Link
                href="/forgot"
                className="text-sm text-purple-300 hover:text-purple-200 transition"
              >
                Forgot password?
              </Link>

              <Link
                href="/signup"
                className="text-sm text-neutral-300 hover:text-white transition"
              >
                Create account
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 py-3 font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-neutral-500 mt-6 leading-5">
          MindMap provides reflection and structured perspective. It is not legal, medical,
          or crisis intervention advice.
        </p>
      </div>
    </div>
  );
}