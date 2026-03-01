"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);

    // This is where Supabase will send the user after they click the email link
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) return setErr(error.message);
    setMsg("If an account exists for that email, a reset link was sent.");
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-md mx-auto bg-[#0b1020] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-neutral-400 mb-6">
          Enter your email and we’ll send you a one-time reset link.
        </p>

        <form onSubmit={sendReset} className="space-y-4">
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

          {err && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          {msg && (
            <div className="text-sm text-green-200 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              {msg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 py-3 font-semibold transition"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-neutral-400 mt-6 text-center">
          Remembered it?{" "}
          <Link href="/signin" className="text-purple-300 hover:text-purple-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}