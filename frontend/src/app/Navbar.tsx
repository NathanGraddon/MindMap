"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type ProfileRow = {
  username: string;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);
  const [username, setUsername] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Load user + username once, and subscribe to auth changes
  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!u) {
        setUser(null);
        setUsername(null);
        return;
      }

      setUser({ id: u.id, email: u.email ?? undefined });

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", u.id)
        .single<ProfileRow>();

      setUsername(profile?.username ?? null);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const profileLabel = username ? username : "Profile";

  return (
    <nav className="w-full bg-[#05070c]/90 backdrop-blur border-b border-white/5 px-8 py-4 flex items-center justify-between">
      {/* Left - Logo */}
      <Link
        href="/"
        className="text-xl font-semibold tracking-wide text-white hover:text-white/90 transition"
      >
        MindMap
      </Link>

      {/* Right - Links + Profile */}
      <div className="flex items-center gap-8 text-sm text-neutral-300">
        <Link href="/about" className="hover:text-white transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-white transition">
          Contact
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="hover:text-white transition flex items-center gap-1"
          >
            {profileLabel} <span className="text-xs opacity-80">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-[#0b1020] border border-white/10 rounded-xl shadow-xl overflow-hidden">
              {!user ? (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/5 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/5 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/history"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/5 transition"
                  >
                    History
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition text-red-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}