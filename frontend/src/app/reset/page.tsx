"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // When user clicks the email link, Supabase establishes a recovery session
  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      setReady(Boolean(data.session));
    }
    check();
  }, []);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 6) {
      return setErr("Password must be at least 6 characters.");
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return setErr(error.message);

    setMsg("Password updated. Redirecting to sign in...");
    setTimeout(() => router.push("/signin"), 1000);
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-md mx-auto bg-[#0b1020] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Set a new password</h1>
        <p className="text-neutral-400 mb-6">
          Choose a new password for your account.
        </p>

        {!ready ? (
          <div className="text-sm text-neutral-300 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            This reset link may be invalid or expired. Try requesting a new one{" "}
            <Link href="/forgot" className="text-purple-300 hover:text-purple-200">
              here
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={updatePassword} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-300">New password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/60"
                placeholder="••••••••"
                type="password"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Must be at least 6 characters.
              </p>
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
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}