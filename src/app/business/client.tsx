"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy, Code2, Globe, Shield, BarChart3, Key, Zap, Database, Clock, Users, Target, Building2, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SNIPPET = `curl -X POST https://www.area-iq.co.uk/api/v1/report \\
  -H "Authorization: Bearer aiq_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"area": "SW1A 1AA", "intent": "moving"}'`;

const RESPONSE = `{
  "id": "rpt_1710000000_abc123",
  "report": {
    "area": "Westminster, SW1A 1AA",
    "intent": "moving",
    "areaiq_score": 78,
    "area_type": "urban",
    "sub_scores": [
      { "label": "Safety", "score": 72, "weight": 25 },
      { "label": "Transport", "score": 94, "weight": 20 },
      { "label": "Schools", "score": 68, "weight": 20 },
      { "label": "Amenities", "score": 86, "weight": 20 },
      { "label": "Environment", "score": 70, "weight": 15 }
    ],
    "summary": "Westminster scores 78/100 for moving...",
    "sections": [ ... ],
    "recommendations": [ ... ]
  }
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 transition-colors cursor-pointer"
      style={{ color: copied ? "var(--neon-green)" : "var(--text-tertiary)", background: "var(--bg-active)" }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const STATS = [
  { value: "6", label: "Data sources" },
  { value: "16", label: "Scoring functions" },
  { value: "4", label: "Intent modes" },
  { value: "<15s", label: "Response time" },
];

const CAPABILITIES = [
  { icon: Key, title: "REST API", desc: "POST a postcode, get a full scored report. JSON response with overall score, dimensional breakdowns, AI narrative, and data-backed reasoning." },
  { icon: Globe, title: "Embeddable widget", desc: "Single script tag on any page. Score card renders automatically with dark and light themes. No API key needed. Under 5KB." },
  { icon: Shield, title: "Deterministic scoring", desc: "16 scoring functions with area-type benchmarks. Same postcode, same intent, same scores. Every time. No hallucination risk." },
  { icon: Database, title: "6 government data sources", desc: "Police.uk, ONS deprivation indices, OpenStreetMap, Environment Agency flood risk, HM Land Registry sold prices, Postcodes.io." },
  { icon: Zap, title: "24h response cache", desc: "First request hits live APIs. Repeat queries served from cache instantly. Cached requests don't count against your quota." },
  { icon: BarChart3, title: "Self-serve dashboard", desc: "Track API calls, monitor per-key activity, view 30-day trends. Manage your integration without contacting support." },
];

const USE_CASES = [
  {
    icon: Building2,
    title: "Property portals",
    desc: "Add area scores to every listing page. Give buyers objective data on safety, transport, schools, and amenities before they visit.",
    integration: "API or widget embed",
  },
  {
    icon: Briefcase,
    title: "Estate agents",
    desc: "Show area quality alongside property details. Help buyers compare neighbourhoods with real data. Embed the score card on your site or pull scores into your CRM.",
    integration: "Widget embed or API",
  },
  {
    icon: TrendingUp,
    title: "Investment platforms",
    desc: "Screen areas at scale for yield, safety, and growth potential. Score 500 postcodes a month on the Business plan. Filter by intent-specific dimensions.",
    integration: "API batch queries",
  },
  {
    icon: Target,
    title: "Relocation companies",
    desc: "Score destination areas for corporate clients automatically. Provide objective area intelligence alongside relocation packages.",
    integration: "API integration",
  },
];

const TIERS = [
  { name: "Developer", price: "£49", reports: "100", perReport: "£0.49", desc: "Solo devs, prototypes" },
  { name: "Business", price: "£249", reports: "500", perReport: "£0.50", desc: "Platforms, integrations", highlight: true },
  { name: "Growth", price: "£499", reports: "1,500", perReport: "£0.33", desc: "Portals, high volume" },
  { name: "Enterprise", price: "Custom", reports: "5,000+", perReport: "Custom", desc: "SLAs, annual contracts" },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar breadcrumbs={[{ label: "Business" }]}>
        <Link
          href="/docs"
          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 transition-colors hover:opacity-80"
          style={{ color: "var(--text-tertiary)" }}
        >
          API Docs
        </Link>
        <Link
          href="/pricing"
          className="h-8 px-4 flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide transition-colors"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          View Pricing <ArrowRight size={12} />
        </Link>
      </Navbar>

      <main className="flex-1">
        {/* Hero - split layout with stats */}
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-12 lg:gap-16 items-start">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }} />
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    REST API + Embeddable widget
                  </span>
                </div>
                <h1 className="text-[32px] md:text-[44px] font-semibold tracking-tight leading-[1.1] mb-5" style={{ color: "var(--text-primary)" }}>
                  Every UK postcode, scored.<br />One API call.
                </h1>
                <p className="text-[13px] leading-relaxed mb-4 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                  Property portals show listings. They don't score the area around them. AreaIQ does. Safety, transport, schools, amenities, environment, and property prices from 6 government sources, scored deterministically and returned as structured JSON.
                </p>
                <p className="text-[12px] leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-tertiary)" }}>
                  No UK competitor offers an area scoring API. Your users get data they can't find anywhere else.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/pricing"
                    className="h-11 px-6 flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
                    style={{ background: "var(--text-primary)", color: "var(--bg)" }}
                  >
                    Start Building <ArrowRight size={12} />
                  </Link>
                  <a
                    href="mailto:hello@area-iq.co.uk?subject=Enterprise API enquiry"
                    className="h-11 px-6 flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
                    style={{ background: "var(--bg-active)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                  >
                    Contact Sales
                  </a>
                </div>
              </div>

              {/* Stats panel */}
              <div className="hidden lg:block border" style={{ borderColor: "var(--border)" }}>
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`px-8 py-4 ${i < STATS.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
                  >
                    <div className="text-[24px] font-mono font-bold" style={{ color: "var(--neon-green)" }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile stats strip */}
            <div className="grid grid-cols-4 gap-px mt-10 lg:hidden" style={{ background: "var(--border)" }}>
              {STATS.map((stat) => (
                <div key={stat.label} className="py-3 text-center" style={{ background: "var(--bg-elevated)" }}>
                  <div className="text-[18px] font-mono font-bold" style={{ color: "var(--neon-green)" }}>
                    {stat.value}
                  </div>
                  <div className="text-[8px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Preview - full-width code */}
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-10 items-start">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>
                  Developer experience
                </div>
                <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
                  One request.<br />Full area intelligence.
                </h2>
                <p className="text-[12px] leading-relaxed mb-6" style={{ color: "var(--text-tertiary)" }}>
                  POST a postcode and an intent. Get back a scored report with dimensional breakdowns, AI narrative, and data-backed reasoning. Four intent modes: moving, investing, business, and research.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="/docs" className="text-[11px] font-mono flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: "var(--neon-green)" }}>
                    <Code2 size={12} /> API docs <ArrowRight size={10} />
                  </Link>
                  <Link href="/docs#embed" className="text-[11px] font-mono flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
                    <Globe size={12} /> Widget docs <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              <div className="space-y-px">
                <div className="p-5" style={{ background: "var(--bg-elevated)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Request</span>
                    <CopyButton text={SNIPPET} />
                  </div>
                  <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto p-4" style={{ background: "var(--bg)", color: "var(--neon-green)", border: "1px solid var(--border)" }}>
                    {SNIPPET}
                  </pre>
                </div>
                <div className="p-5" style={{ background: "var(--bg-elevated)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Response</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5" style={{ color: "var(--neon-green)", background: "var(--neon-green-dim)" }}>200 OK</span>
                  </div>
                  <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto p-4" style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    {RESPONSE}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities - horizontal list, not cards */}
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>
              What you're integrating
            </div>
            <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-10" style={{ color: "var(--text-primary)" }}>
              Built to embed, not just display
            </h2>

            <div className="space-y-0">
              {CAPABILITIES.map((item, i) => (
                <div
                  key={item.title}
                  className={`grid grid-cols-1 md:grid-cols-[200px,1fr] gap-4 md:gap-8 py-5 ${i < CAPABILITIES.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={14} style={{ color: "var(--accent)" }} />
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases - staggered layout */}
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--neon-amber)" }}>
              Use cases
            </div>
            <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-10" style={{ color: "var(--text-primary)" }}>
              Who this is for
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USE_CASES.map((item) => (
                <div
                  key={item.title}
                  className="border p-6"
                  style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ background: "var(--bg-active)", border: "1px solid var(--border)" }}
                    >
                      <item.icon size={14} style={{ color: "var(--accent)" }} />
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </div>
                  <div
                    className="text-[10px] font-mono inline-block px-2 py-0.5"
                    style={{ color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
                  >
                    {item.integration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing summary */}
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-20">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              API pricing
            </div>
            <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-10" style={{ color: "var(--text-primary)" }}>
              Scale as you grow
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "var(--border)" }}>
              {TIERS.map((tier) => (
                <div key={tier.name} className="p-6 relative" style={{ background: "var(--bg-elevated)" }}>
                  {tier.highlight && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--neon-green)" }} />}
                  <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{tier.name}</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[28px] font-mono font-bold" style={{ color: "var(--text-primary)" }}>{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>/mo</span>}
                  </div>
                  <div className="text-[11px] font-mono mb-1" style={{ color: "var(--neon-green)" }}>{tier.reports} reports / month</div>
                  <div className="text-[10px] font-mono mb-2" style={{ color: "var(--text-tertiary)" }}>{tier.perReport} / report</div>
                  <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{tier.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6" style={{ color: "var(--text-tertiary)" }}>
              {[
                { icon: Clock, text: "Cancel anytime" },
                { icon: Shield, text: "No setup fee" },
                { icon: Users, text: "Self-serve onboarding" },
                { icon: Zap, text: "Cached queries are free" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-[10px] font-mono">
                  <item.icon size={11} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-[26px] md:text-[34px] font-semibold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
              Ready to integrate?
            </h2>
            <p className="text-[14px] mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Get API access in under 2 minutes. Create an account, subscribe to a plan, generate your key, and start building.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/pricing"
                className="h-12 px-10 flex items-center gap-2 text-[12px] font-mono font-medium uppercase tracking-wide"
                style={{ background: "var(--text-primary)", color: "var(--bg)" }}
              >
                Get API Access <ArrowRight size={13} />
              </Link>
              <a
                href="mailto:hello@area-iq.co.uk?subject=Enterprise API enquiry"
                className="h-12 px-10 flex items-center gap-2 text-[12px] font-mono font-medium uppercase tracking-wide"
                style={{ background: "var(--bg-active)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Talk to Sales
              </a>
            </div>
            <div className="mt-4 text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
              Developer plan starts at £49/mo. No commitment.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
