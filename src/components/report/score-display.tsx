"use client";

import { useEffect, useState, useRef } from "react";
import { getRAG } from "@/lib/rag";

/* ── Animated number ── */
export function AnimatedNumber({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }

    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);

  return <span className={className} style={style}>{display}</span>;
}

/* ── Score Ring ── */
export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { color } = getRAG(score);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="score-ring" width={size} height={size}>
        <circle className="score-ring-track" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="score-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber value={score} className={`text-[28px] font-mono font-bold tracking-tight ${getRAG(score).glow}`} style={{ color }} />
        <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>/100</span>
      </div>
    </div>
  );
}

/* ── Score Context Bar ── */
export function ScoreContextBar({ score }: { score: number }) {
  const [mounted, setMounted] = useState(false);
  const { color } = getRAG(score);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Score Distribution</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--text-tertiary)" }}>0 to 100</span>
      </div>
      <div className="relative h-2 w-full" style={{ background: "var(--border)" }}>
        {/* RAG zones */}
        <div className="absolute inset-0 flex">
          <div className="h-full" style={{ width: "45%", background: "var(--neon-red-dim)" }} />
          <div className="h-full" style={{ width: "25%", background: "var(--neon-amber-dim)" }} />
          <div className="h-full" style={{ width: "30%", background: "var(--neon-green-dim)" }} />
        </div>
        {/* Score marker */}
        <div
          className="absolute top-0 h-full w-0.5 transition-all duration-1000 ease-out"
          style={{
            left: mounted ? `${score}%` : "0%",
            background: color,
            boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[8px] font-mono" style={{ color: "var(--neon-red)", opacity: 0.6 }}>Weak</span>
        <span className="text-[8px] font-mono" style={{ color: "var(--neon-amber)", opacity: 0.6 }}>Moderate</span>
        <span className="text-[8px] font-mono" style={{ color: "var(--neon-green)", opacity: 0.6 }}>Strong</span>
      </div>
    </div>
  );
}
