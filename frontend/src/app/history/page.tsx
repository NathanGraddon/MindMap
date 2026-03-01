"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
type AnalysisResult = {
    best_option: string;
    second_best_option: string;
    rationale: string;
    next_step: string;
    urgency_level: "Low" | "Moderate" | "High";
    detected_type: string;
    key_risk: string;
    biggest_tradeoff: string;
    options: Array<{
      name: string;
      description: string;
      well_being: number;
      ethics: number;
      impact_on_others: number;
      practicality: number;
      long_term_growth: number;
      total_score: number;
    }>;
  };
type HistoryRow = {
  id: number;
  created_at: string;
  dilemma: string;
  result: AnalysisResult;
};

export default function HistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setAuthed(false);
        setLoading(false);
        return;
      }

      setAuthed(true);

      const { data } = await supabase
        .from("decision_history")
        .select("id, created_at, dilemma, result")
        .order("created_at", { ascending: false });

      setRows((data as HistoryRow[]) ?? []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-20">
        <div className="max-w-4xl mx-auto text-neutral-400">Loading history...</div>
      </div>
    );
  }

  if (authed === false) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-20">
        <div className="max-w-4xl mx-auto bg-[#0b1020] border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-neutral-400 mb-6">
            Sign in to view your saved decision history.
          </p>
          <Link
            href="/signin"
            className="inline-block px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Your Decision History</h1>

        {rows.length === 0 ? (
          <p className="text-neutral-400">No saved decisions yet. Run an analysis to start building history.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div
                key={row.id}
                className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition"
              >
                <div className="text-xs text-neutral-500 mb-2">
                  {new Date(row.created_at).toLocaleString()}
                </div>
                <div className="font-semibold text-lg mb-2">{row.dilemma}</div>
                <div className="text-neutral-400 text-sm">
                  Best option: <span className="text-neutral-200">{row.result?.best_option}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}