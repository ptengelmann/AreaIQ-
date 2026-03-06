"use client";

import { AreaReport } from "@/lib/types";

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "#22c55e" : score >= 45 ? "#eab308" : "#ef4444";

  return (
    <div
      className="h-[3px] w-full"
      style={{ background: "var(--border)" }}
    >
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  const color =
    score >= 70 ? "#22c55e" : score >= 45 ? "#eab308" : "#ef4444";

  return (
    <div className="flex items-baseline gap-1">
      <span
        className="text-[32px] font-semibold tracking-tight font-mono"
        style={{ color }}
      >
        {score}
      </span>
      <span
        className="text-[13px] font-mono"
        style={{ color: "var(--text-tertiary)" }}
      >
        /100
      </span>
    </div>
  );
}

export function ReportView({ report }: { report: AreaReport }) {
  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span
            className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 border"
            style={{
              color: "var(--text-tertiary)",
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            {report.intent}
          </span>
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            {new Date(report.generated_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <h1
          className="text-[24px] font-semibold tracking-tight mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          {report.area}
        </h1>
        <p
          className="text-[14px] mt-2 max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {report.summary}
        </p>
      </div>

      {/* Score + Sub-scores */}
      <div
        className="border p-5 mb-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <div
              className="text-[11px] font-mono uppercase tracking-wider mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              AreaIQ Score
            </div>
            <ScoreDisplay score={report.areaiq_score} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {report.sub_scores.map((sub) => (
            <div key={sub.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {sub.label}
                </span>
                <span
                  className="text-[11px] font-mono"
                  style={{
                    color:
                      sub.score >= 70
                        ? "#22c55e"
                        : sub.score >= 45
                          ? "#eab308"
                          : "#ef4444",
                  }}
                >
                  {sub.score}
                </span>
              </div>
              <ScoreBar score={sub.score} />
              <p
                className="text-[11px] mt-1.5 leading-snug"
                style={{ color: "var(--text-tertiary)" }}
              >
                {sub.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-6">
        {report.sections.map((section, i) => (
          <div
            key={i}
            className="border p-5"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h2
              className="text-[14px] font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {section.title}
            </h2>
            <div
              className="text-[13px] leading-relaxed whitespace-pre-line mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {section.content}
            </div>

            {section.data_points && section.data_points.length > 0 && (
              <div
                className="border-t pt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2"
                style={{ borderColor: "var(--border)" }}
              >
                {section.data_points.map((dp, j) => (
                  <div key={j}>
                    <div
                      className="text-[10px] font-mono uppercase tracking-wider"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {dp.label}
                    </div>
                    <div
                      className="text-[13px] font-mono mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {dp.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <div
          className="border p-5"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-elevated)",
          }}
        >
          <h2
            className="text-[14px] font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Recommendations
          </h2>
          <div className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="text-[11px] font-mono mt-0.5 shrink-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="mt-6 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          Generated by AreaIQ
        </span>
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          {report.generated_at}
        </span>
      </div>
    </div>
  );
}
