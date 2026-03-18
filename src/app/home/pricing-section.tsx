"use client";

import { useState } from "react";
import { ArrowRight, Users, Code } from "lucide-react";
import Link from "next/link";

/* ── Pricing Section (matches /pricing page) ── */
type LandingPlan = {
  tier: string; price: string; period: string; reports: string;
  desc: string; features: string[]; cta: string;
  ctaStyle: { background: string; color: string };
  perReport?: string; highlight?: boolean;
};

export function PricingSection() {
  const [tab, setTab] = useState<"consumer" | "api">("consumer");

  const consumerPlans: LandingPlan[] = [
    {
      tier: "Free", price: "£0", period: "forever", reports: "3 reports / month",
      desc: "Try it out",
      features: ["All 7 data sources", "All intent types", "Deterministic scoring", "Share & email delivery", "Watchlist & CSV export"],
      cta: "Get Started", ctaStyle: { background: "var(--bg-active)", color: "var(--text-primary)" },
    },
    {
      tier: "Starter", price: "£29", period: "/mo", reports: "20 reports / month",
      desc: "For freelance agents and landlords",
      features: ["Everything in Free", "PDF export", "Area comparison", "Billing management"],
      cta: "Get Started", ctaStyle: { background: "var(--bg-active)", color: "var(--text-primary)" },
    },
    {
      tier: "Pro", price: "£79", period: "/mo", reports: "75 reports / month",
      desc: "For agencies and active investors",
      features: ["Everything in Starter", "75 reports per month", "Property Market data", "Email support"],
      cta: "Upgrade to Pro", ctaStyle: { background: "var(--text-primary)", color: "var(--bg)" },
      highlight: true,
    },
  ];

  const apiPlans: LandingPlan[] = [
    {
      tier: "Developer", price: "£49", period: "/mo", reports: "100 API reports / month",
      perReport: "£0.49 / report",
      desc: "For solo devs and small PropTech builders",
      features: ["REST API access", "API key management", "Full documentation", "Usage dashboard"],
      cta: "Start Building", ctaStyle: { background: "var(--bg-active)", color: "var(--text-primary)" },
    },
    {
      tier: "Business", price: "£249", period: "/mo", reports: "500 API reports / month",
      perReport: "£0.50 / report",
      desc: "For platforms and integrations",
      features: ["Everything in Developer", "500 API reports", "Priority support", "Usage dashboard"],
      cta: "Get Business", ctaStyle: { background: "var(--text-primary)", color: "var(--bg)" },
      highlight: true,
    },
    {
      tier: "Growth", price: "£499", period: "/mo", reports: "1,500 API reports / month",
      perReport: "£0.33 / report",
      desc: "For portals and high-volume platforms",
      features: ["Everything in Business", "1,500 API reports", "Priority support", "Usage dashboard"],
      cta: "Get Growth", ctaStyle: { background: "var(--bg-active)", color: "var(--text-primary)" },
    },
  ];

  const plans = tab === "consumer" ? consumerPlans : apiPlans;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-10">
        <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>Pricing</div>
        <h2 className="text-[22px] md:text-[28px] font-semibold tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
          Start free. Scale when ready.
        </h2>
        <p className="text-[14px] max-w-md mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
          Every plan includes all 7 data sources, all intent types, and full scored reports.
        </p>

        <div className="inline-flex gap-0 p-0.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setTab("consumer")}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide transition-colors cursor-pointer"
            style={{
              background: tab === "consumer" ? "var(--bg-active)" : "transparent",
              color: tab === "consumer" ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
          >
            <Users size={12} /> Web Reports
          </button>
          <button
            onClick={() => setTab("api")}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide transition-colors cursor-pointer"
            style={{
              background: tab === "api" ? "var(--bg-active)" : "transparent",
              color: tab === "api" ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
          >
            <Code size={12} /> API Access
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px max-w-[900px] mx-auto" style={{ background: "var(--border)" }}>
        {plans.map((item) => (
          <div key={item.tier} className="p-6 flex flex-col" style={{ background: item.highlight ? "var(--bg-active)" : "var(--bg-elevated)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{item.tier}</span>
              {item.highlight && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5" style={{ color: "var(--neon-green)", background: "var(--neon-green-dim)" }}>Popular</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[32px] font-mono font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.price}</span>
              <span className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>{item.period}</span>
            </div>
            <div className="text-[11px] font-mono mb-1" style={{ color: "var(--neon-green)" }}>{item.reports}</div>
            {item.perReport && (
              <div className="text-[10px] font-mono mb-1" style={{ color: "var(--text-tertiary)" }}>{item.perReport}</div>
            )}
            <div className="text-[11px] mb-5" style={{ color: "var(--text-tertiary)" }}>{item.desc}</div>
            <div className="space-y-2 mb-6 flex-1">
              {item.features.map((f) => (
                <div key={f} className="text-[11px] flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <span className="text-[9px]" style={{ color: "var(--neon-green)" }}>&#10003;</span>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={item.tier === "Free" ? "/report" : "/pricing"}
              className="h-9 flex items-center justify-center text-[11px] font-mono font-medium uppercase tracking-wide transition-colors"
              style={item.ctaStyle}
            >
              {item.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link href="/pricing" className="text-[11px] font-mono inline-flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
          View full comparison <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
