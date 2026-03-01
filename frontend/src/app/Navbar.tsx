"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#05070c]/90 backdrop-blur border-b border-white/5 px-8 py-4 flex items-center justify-between">
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

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-white transition flex items-center gap-1"
          >
            Profile <span className="text-xs opacity-80">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-[#0b1020] border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <Link
                href="/signin"
                className="block px-4 py-2 text-sm hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm hover:bg-white/5 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}