"use client";

import { useEffect, useState } from "react";
import { getRAG } from "@/lib/rag";

/* ── Sub-score detail bar ── */
export function SubScoreBar({ label, score, weight, summary, reasoning, delay }: { label: string; score: number; weight?: number; summary: string; reasoning?: string; delay: number }) {
  const [mounted, setMounted] = useState(false);
  const { color, dim, glow } = getRAG(score);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>{label}</span>
          {weight && (
            <span className="text-[9px] font-mono px-1 py-px" style={{ color: "var(--text-tertiary)", background: "var(--bg)" }}>
              {weight}%
            </span>
          )}
        </div>
        <span className={`text-[13px] font-mono font-semibold ${glow}`} style={{ color }}>
          {mounted ? score : 0}
        </span>
      </div>
      <div className="h-1.5 w-full" style={{ background: dim }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: mounted ? `${score}%` : "0%", background: color }}
        />
      </div>
      <p className="text-[10px] mt-1.5 leading-snug" style={{ color: "var(--text-tertiary)" }}>{summary}</p>
      {reasoning && (
        <p className="text-[9px] font-mono mt-1 leading-snug" style={{ color: "var(--text-tertiary)", opacity: 0.7 }}>
          Data: {reasoning}
        </p>
      )}
    </div>
  );
}
