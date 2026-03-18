"use client";

import { useState } from "react";
import { ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";

/* ── Widget Code Snippet with Copy ── */
export function WidgetCodeSnippet() {
  const [copied, setCopied] = useState(false);
  const snippet = `<div
  data-areaiq-postcode="SW1A 1AA"
  data-areaiq-intent="moving"
></div>

<script src="https://www.area-iq.co.uk/widget.js"></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="p-8 flex flex-col justify-center" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          HTML
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 transition-colors cursor-pointer"
          style={{ color: copied ? "var(--neon-green)" : "var(--text-tertiary)", background: "var(--bg-active)" }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="text-[12px] font-mono p-5 overflow-x-auto leading-relaxed"
        style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
      >
        {snippet}
      </pre>
      <div className="mt-4 flex items-center gap-4">
        <Link href="/docs#embed" className="text-[11px] font-mono flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: "var(--neon-green)" }}>
          Full docs <ArrowRight size={10} />
        </Link>
        <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>
          Dark and light themes available
        </span>
      </div>
    </div>
  );
}
