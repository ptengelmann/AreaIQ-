"use client";

import { useEffect, useState } from "react";
import { AreaReport } from "@/lib/types";
import { getRAG } from "@/lib/rag";

/* ── Radar Chart ── */
export function RadarChart({ subScores, size = 220 }: { subScores: AreaReport["sub_scores"]; size?: number }) {
  const [mounted, setMounted] = useState(false);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 30;
  const levels = [20, 40, 60, 80, 100];
  const count = subScores.length;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  function getPoint(index: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function getPolygon(value: number): string {
    return Array.from({ length: count }, (_, i) => getPoint(i, value).join(",")).join(" ");
  }

  const dataPoints = subScores.map((s, i) => getPoint(i, mounted ? s.score : 0));
  const dataPolygon = dataPoints.map(p => p.join(",")).join(" ");

  // Compute average color based on average score
  const avgScore = subScores.reduce((sum, s) => sum + s.score, 0) / subScores.length;
  const { color: fillColor } = getRAG(avgScore);

  return (
    <div className="relative py-4 px-8" style={{ width: size + 64, height: size + 32 }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Grid levels */}
        {levels.map((level) => (
          <polygon
            key={level}
            points={getPolygon(level)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={level === 100 ? 1 : 0.5}
            opacity={level === 100 ? 0.8 : 0.4}
          />
        ))}

        {/* Axis lines */}
        {subScores.map((_, i) => {
          const [x, y] = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygon}
          fill={fillColor}
          fillOpacity={0.1}
          stroke={fillColor}
          strokeWidth={1.5}
          style={{
            transition: "all 0.8s ease-out",
            filter: `drop-shadow(0 0 4px ${fillColor})`,
          }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => {
          const { color } = getRAG(subScores[i].score);
          return (
            <circle
              key={i}
              cx={point[0]}
              cy={point[1]}
              r={3}
              fill={color}
              stroke="var(--bg)"
              strokeWidth={1}
              style={{
                transition: "all 0.8s ease-out",
                filter: `drop-shadow(0 0 3px ${color})`,
              }}
            />
          );
        })}

        {/* Labels */}
        {subScores.map((sub, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const labelR = maxR + 20;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          const { color } = getRAG(sub.score);

          // Determine text anchor based on position
          let anchor: "start" | "middle" | "end" = "middle";
          if (Math.cos(angle) > 0.3) anchor = "start";
          else if (Math.cos(angle) < -0.3) anchor = "end";

          return (
            <g key={i}>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="var(--text-tertiary)"
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {sub.label}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill={color}
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight="600"
              >
                {mounted ? sub.score : 0}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
