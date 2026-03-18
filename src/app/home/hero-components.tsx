"use client";

import { useEffect, useState, useRef } from "react";

/* ── Animated Score Ring ── */
export function HeroScoreRing({ score, label, size = 100 }: { score: number; label: string; size?: number }) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--neon-green)" : score >= 45 ? "var(--neon-amber)" : "var(--neon-red)";
  const glow = score >= 70 ? "neon-green-glow" : score >= 45 ? "neon-amber-glow" : "neon-red-glow";

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="score-ring" width={size} height={size}>
          <circle className="score-ring-track" cx={size / 2} cy={size / 2} r={radius} />
          <circle
            className="score-ring-fill"
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[24px] font-mono font-bold ${glow}`} style={{ color }}>
            {mounted ? score : 0}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-mono mt-2" style={{ color: "var(--text-tertiary)" }}>{label}</span>
    </div>
  );
}

/* ── Animated Counter ── */
export function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setVal(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          function tick(now: number) {
            const p = Math.min((now - start) / 1200, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Typing Effect ── */
export function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[index];
    if (!deleting && charIndex < text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 60);
      return () => clearTimeout(t);
    } else if (!deleting && charIndex === text.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    } else if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), 30);
      return () => clearTimeout(t);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
  }, [charIndex, deleting, index, texts]);

  return (
    <span>
      {texts[index].slice(0, charIndex)}
      <span className="animate-blink" style={{ color: "var(--accent)" }}>|</span>
    </span>
  );
}

/* ── Mock Sub-Score Bar ── */
export function MockBar({ label, score, weight, delay }: { label: string; score: number; weight: number; delay: number }) {
  const [mounted, setMounted] = useState(false);
  const color = score >= 70 ? "var(--neon-green)" : score >= 45 ? "var(--neon-amber)" : "var(--neon-red)";
  const dim = score >= 70 ? "var(--neon-green-dim)" : score >= 45 ? "var(--neon-amber-dim)" : "var(--neon-red-dim)";
  const glow = score >= 70 ? "neon-green-glow" : score >= 45 ? "neon-amber-glow" : "neon-red-glow";

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>{label}</span>
          <span className="text-[8px] font-mono px-1" style={{ color: "var(--text-tertiary)", background: "var(--bg)" }}>{weight}%</span>
        </div>
        <span className={`text-[11px] font-mono font-semibold ${glow}`} style={{ color }}>{mounted ? score : 0}</span>
      </div>
      <div className="h-1 w-full" style={{ background: dim }}>
        <div className="h-full transition-all duration-700 ease-out" style={{ width: mounted ? `${score}%` : "0%", background: color }} />
      </div>
    </div>
  );
}

/* ── Data Source Badge ── */
export function SourceBadge({ name, live }: { name: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 border" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      {live && <span className="w-1.5 h-1.5 rounded-full neon-dot" style={{ color: "var(--neon-green)", background: "var(--neon-green)" }} />}
      <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>{name}</span>
    </div>
  );
}

/* ── Hero Terminal ── */
export function HeroTerminal() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delays = [300, 800, 1100, 1300, 1500, 1700, 1900, 2300, 2600, 2800, 3000, 3200, 3400, 3800];
    const timers = delays.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const sources = [
    { name: "Police.uk", result: "23 crimes/month" },
    { name: "ONS IMD 2025", result: "Decile 7 of 10" },
    { name: "OpenStreetMap", result: "42 amenities nearby" },
    { name: "Env. Agency", result: "Flood risk: LOW" },
    { name: "Ofsted", result: "3 Good, 1 Outstanding" },
    { name: "Postcodes.io", result: "51.462°N, 0.138°W" },
  ];

  const scores: { label: string; score: number }[] = [
    { label: "Safety", score: 72 },
    { label: "Transport", score: 88 },
    { label: "Amenities", score: 81 },
    { label: "Demographics", score: 68 },
    { label: "Environment", score: 62 },
  ];

  return (
    <div className="border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
      {/* Chrome */}
      <div
        className="px-3.5 py-2.5 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <span className="text-[9px] font-mono tracking-wide" style={{ color: "var(--text-tertiary)" }}>
          areaiq
        </span>
      </div>

      {/* Body — fixed height prevents layout shift during animation */}
      <div className="p-4 font-mono text-[11px] h-[340px] overflow-hidden">
        {/* Command */}
        {step >= 1 && (
          <div className="mb-3 leading-relaxed">
            <span style={{ color: "var(--neon-green)" }}>→ </span>
            <span style={{ color: "var(--text-tertiary)" }}>report </span>
            <span style={{ color: "var(--accent)" }}>&quot;Clapham, SW4&quot;</span>
            <span style={{ color: "var(--text-tertiary)" }}> --intent </span>
            <span style={{ color: "var(--neon-amber)" }}>moving</span>
          </div>
        )}

        {/* Sources header */}
        {step >= 2 && (
          <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            Fetching live data
          </div>
        )}

        {/* Source lines */}
        {sources.map((src, i) =>
          step >= 3 + i ? (
            <div key={src.name} className="flex items-center gap-2 py-[3px]">
              <span className="w-3 text-center" style={{ color: "var(--neon-green)" }}>✓</span>
              <span className="w-[100px] shrink-0 truncate" style={{ color: "var(--text-secondary)" }}>{src.name}</span>
              <span style={{ color: "var(--text-tertiary)" }}>{src.result}</span>
            </div>
          ) : null
        )}

        {/* Scores header */}
        {step >= 8 && (
          <div className="text-[9px] uppercase tracking-wider mt-4 mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            Intelligence scores
          </div>
        )}

        {/* Score bars */}
        {scores.map((s, i) => {
          if (step < 9 + i) return null;
          const color = s.score >= 70 ? "var(--neon-green)" : s.score >= 45 ? "var(--neon-amber)" : "var(--neon-red)";
          const dim = s.score >= 70 ? "var(--neon-green-dim)" : s.score >= 45 ? "var(--neon-amber-dim)" : "var(--neon-red-dim)";
          return (
            <div key={s.label} className="flex items-center gap-2 py-[3px]">
              <span className="w-[88px] shrink-0 text-[10px]" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
              <div className="flex-1 h-[5px]" style={{ background: dim }}>
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{ width: `${s.score}%`, background: color, boxShadow: `0 0 4px ${color}` }}
                />
              </div>
              <span className="w-[20px] text-right text-[10px] font-semibold" style={{ color }}>{s.score}</span>
            </div>
          );
        })}

        {/* Final score */}
        {step >= 14 && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="text-[10px] font-semibold tracking-wider" style={{ color: "var(--text-primary)" }}>
              AREAIQ SCORE
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold neon-green-glow" style={{ color: "var(--neon-green)" }}>74</span>
              <span
                className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5"
                style={{ color: "var(--neon-green)", background: "var(--neon-green-dim)" }}
              >
                Strong
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
