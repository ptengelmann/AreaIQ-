"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, CreditCard, Loader2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface ReportSummary {
  id: string;
  area: string;
  intent: string;
  score: number;
  created_at: string;
}

function getRAG(score: number) {
  if (score >= 70) return { color: "var(--neon-green)", dim: "var(--neon-green-dim)", glow: "neon-green-glow", label: "Strong" };
  if (score >= 45) return { color: "var(--neon-amber)", dim: "var(--neon-amber-dim)", glow: "neon-amber-glow", label: "Moderate" };
  return { color: "var(--neon-red)", dim: "var(--neon-red-dim)", glow: "neon-red-glow", label: "Weak" };
}

interface DashboardProps {
  reports: ReportSummary[];
  plan: string;
  planName: string;
  used: number;
  limit: number;
}

export function DashboardClient({ reports, plan, planName, used, limit }: DashboardProps) {
  const [portalLoading, setPortalLoading] = useState(false);

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setPortalLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {/* Header */}
      <header className="border-b shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[13px] font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              AreaIQ
            </Link>
            <span className="text-[10px] font-mono" style={{ color: "var(--border-hover)" }}>/</span>
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/report"
              className="h-7 px-3 flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase tracking-wide transition-colors"
              style={{ background: "var(--text-primary)", color: "var(--bg)" }}
            >
              <Plus size={11} />
              New Report
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
        {/* Plan & Usage */}
        <div className="grid grid-cols-[1fr_1fr] gap-px mb-6" style={{ background: "var(--border)" }}>
          <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
            <div className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              Current Plan
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {planName}
              </span>
              {plan === "free" ? (
                <Link
                  href="/pricing"
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 transition-colors"
                  style={{ color: "var(--neon-green)", background: "var(--neon-green-dim)" }}
                >
                  Upgrade
                </Link>
              ) : (
                <button
                  onClick={openBillingPortal}
                  disabled={portalLoading}
                  className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 transition-colors"
                  style={{ color: "var(--text-tertiary)", background: "var(--bg-active)" }}
                >
                  {portalLoading ? <Loader2 size={10} className="animate-spin" /> : <CreditCard size={10} />}
                  Manage
                </button>
              )}
            </div>
          </div>
          <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
            <div className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
              Monthly Usage
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
                {used}
                <span className="text-[12px] font-normal" style={{ color: "var(--text-tertiary)" }}>
                  /{limit === Infinity ? "∞" : limit}
                </span>
              </span>
              <div className="flex-1 h-1.5" style={{ background: "var(--border)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: limit === Infinity ? "0%" : `${Math.min((used / limit) * 100, 100)}%`,
                    background: used >= limit && limit !== Infinity ? "var(--neon-red)" : "var(--neon-green)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-[22px] font-semibold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            My Reports
          </h1>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {reports.length} report{reports.length !== 1 ? "s" : ""} generated
          </p>
        </div>

        {reports.length === 0 ? (
          <div
            className="border p-12 text-center"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="text-[13px] mb-2" style={{ color: "var(--text-secondary)" }}>
              No reports yet
            </div>
            <div className="text-[11px] mb-6" style={{ color: "var(--text-tertiary)" }}>
              Generate your first area intelligence report.
            </div>
            <Link
              href="/report"
              className="inline-flex h-9 px-5 items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
              style={{ background: "var(--text-primary)", color: "var(--bg)" }}
            >
              Generate Report
              <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="border" style={{ borderColor: "var(--border)" }}>
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_120px_80px_80px_140px_40px] gap-4 px-5 py-2.5 border-b"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Area</span>
              <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Intent</span>
              <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Score</span>
              <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Status</span>
              <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Generated</span>
              <span />
            </div>

            {/* Table rows */}
            {reports.map((report) => {
              const rag = getRAG(report.score);
              return (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="grid grid-cols-[1fr_120px_80px_80px_140px_40px] gap-4 px-5 py-3 border-b transition-colors hover:brightness-110"
                  style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                  <span className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {report.area}
                  </span>
                  <span className="text-[11px] font-mono uppercase" style={{ color: "var(--text-tertiary)" }}>
                    {report.intent}
                  </span>
                  <span className={`text-[13px] font-mono font-semibold ${rag.glow}`} style={{ color: rag.color }}>
                    {report.score}
                  </span>
                  <span
                    className="text-[10px] font-mono self-center"
                    style={{ color: rag.color }}
                  >
                    {rag.label}
                  </span>
                  <span className="text-[11px] font-mono self-center" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(report.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center justify-end">
                    <ArrowRight size={12} style={{ color: "var(--text-tertiary)" }} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-10 flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>AreaIQ</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>Area intelligence, instantly.</span>
        </div>
      </footer>
    </div>
  );
}
