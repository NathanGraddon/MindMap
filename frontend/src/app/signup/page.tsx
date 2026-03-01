"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username.trim()) return setError("Please enter a username.");
    if (!email.trim()) return setError("Please enter an email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    // 1) Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      return setError(signUpError.message);
    }

    const user = data.user;
    if (!user) {
      setLoading(false);
      return setMessage("Check your email to confirm your account, then sign in.");
    }

    // 2) Insert username into profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      username: username.trim(),
    });

    setLoading(false);

    if (profileError) {
      // This can happen if email confirmation is required and user session isn't active yet.
      // It's okay—user can sign in and we can ask again, but usually it works if session exists.
      return setMessage(
        "Account created. If you have email confirmation enabled, confirm your email, then sign in."
      );
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-md mx-auto bg-[#0b1020] border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-neutral-400 mb-6">
          Save your decision history and get personalized greetings.
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/60"
              placeholder="yourname"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/60"
              placeholder="you@udel.edu"
              type="email"
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
            />
            <p className="text-xs text-neutral-500 mt-2">
              Must be at least 6 characters.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-green-200 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 py-3 font-semibold transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-neutral-400 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-purple-300 hover:text-purple-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}