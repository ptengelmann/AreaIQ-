"use client";

import { useEffect, useState, useRef } from "react";
import { getRAG } from "@/lib/rag";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  className?: string;
}

export function ScoreRing({ score, size = 120, strokeWidth = 3, animated = true, className = "" }: ScoreRingProps) {
  const [display, setDisplay] = useState(animated ? 0 : score);
  const ref = useRef<number | null>(null);
  const rag = getRAG(score);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (display / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setDisplay(score);
      return;
    }
    let start: number | null = null;
    const duration = 1200;
    function step(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setDisplay(Math.round(eased * score));
      if (pct < 1) ref.current = requestAnimationFrame(step);
    }
    ref.current = requestAnimationFrame(step);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [score, animated]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={rag.color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold ${rag.glow}`} style={{ color: rag.color, fontSize: size * 0.28 }}>
          {display}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          / 100
        </span>
      </div>
    </div>
  );
}
