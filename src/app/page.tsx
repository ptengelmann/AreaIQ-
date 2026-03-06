"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { AreaReport, Intent } from "@/lib/types";
import { ReportView } from "@/components/report-view";

const intents: { value: Intent; label: string; desc: string }[] = [
  { value: "moving", label: "Moving", desc: "Evaluate for living" },
  { value: "business", label: "Business", desc: "Open a business" },
  { value: "investing", label: "Investing", desc: "Investment potential" },
  { value: "research", label: "Research", desc: "General overview" },
];

export default function Home() {
  const [area, setArea] = useState("");
  const [intent, setIntent] = useState<Intent>("research");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AreaReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!area.trim() || loading) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: area.trim(), intent }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await res.json();
      setReport(data.report);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-[13px] font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              AreaIQ
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 border"
              style={{
                color: "var(--text-tertiary)",
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              v1
            </span>
          </div>
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            area intelligence
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1200px] mx-auto px-6">
        {!report && !loading && (
          <div className="animate-fade-in" style={{ paddingTop: "min(20vh, 160px)" }}>
            {/* Hero */}
            <div className="mb-10">
              <h1
                className="text-[28px] font-semibold tracking-tight mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Know any area. Instantly.
              </h1>
              <p
                className="text-[14px] max-w-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Enter a location and intent. Get a scored, structured
                intelligence report in seconds.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-xl">
              {/* Area Input */}
              <div className="mb-4">
                <label
                  className="block text-[11px] font-mono uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Area
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Shoreditch, London or Austin, TX 78701"
                    className="w-full h-10 pl-9 pr-4 text-[13px] border"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Intent Selection */}
              <div className="mb-6">
                <label
                  className="block text-[11px] font-mono uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Intent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {intents.map((i) => (
                    <button
                      key={i.value}
                      type="button"
                      onClick={() => setIntent(i.value)}
                      className="h-[62px] border text-left px-3 py-2.5 transition-colors"
                      style={{
                        background:
                          intent === i.value
                            ? "var(--bg-hover)"
                            : "var(--bg-elevated)",
                        borderColor:
                          intent === i.value
                            ? "var(--border-hover)"
                            : "var(--border)",
                      }}
                    >
                      <div
                        className="text-[12px] font-medium"
                        style={{
                          color:
                            intent === i.value
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                        }}
                      >
                        {i.label}
                      </div>
                      <div
                        className="text-[11px] mt-0.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {i.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!area.trim() || loading}
                className="h-10 px-5 border flex items-center gap-2 text-[13px] font-medium transition-colors disabled:opacity-30"
                style={{
                  background: "var(--text-primary)",
                  borderColor: "var(--text-primary)",
                  color: "var(--bg)",
                }}
              >
                Generate Report
                <ArrowRight size={14} />
              </button>

              {error && (
                <p className="mt-4 text-[13px]" style={{ color: "#ef4444" }}>
                  {error}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            className="animate-fade-in flex flex-col items-center justify-center"
            style={{ paddingTop: "min(25vh, 200px)" }}
          >
            <Loader2
              size={20}
              className="animate-spin mb-4"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p
              className="text-[13px] font-mono"
              style={{ color: "var(--text-secondary)" }}
            >
              Researching {area}...
            </p>
            <p
              className="text-[11px] font-mono mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Pulling data, analysing, scoring
            </p>
          </div>
        )}

        {/* Report */}
        {report && !loading && (
          <div className="animate-fade-in py-8">
            <button
              onClick={() => {
                setReport(null);
                setArea("");
              }}
              className="text-[12px] font-mono mb-6 flex items-center gap-1.5 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
            >
              <ArrowRight size={12} className="rotate-180" />
              New report
            </button>
            <ReportView report={report} />
          </div>
        )}
      </main>
    </div>
  );
}
