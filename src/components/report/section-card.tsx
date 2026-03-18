"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AreaReport } from "@/lib/types";

/* ── Collapsible Section Card ── */
export function SectionCard({ section, index, defaultOpen = false }: { section: AreaReport["sections"][0]; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border animate-fade-in-up"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", animationDelay: `${200 + index * 80}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:brightness-110"
        style={{ borderBottom: open ? "1px solid var(--border)" : "none" }}
      >
        <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-[13px] font-semibold text-left flex-1" style={{ color: "var(--text-primary)" }}>
          {section.title}
        </h2>
        {section.data_points && section.data_points.length > 0 && !open && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 hidden sm:block" style={{ color: "var(--text-tertiary)", background: "var(--bg)" }}>
            {section.data_points.length} data points
          </span>
        )}
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--text-tertiary)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <>
          <div className="px-5 py-4">
            <div className="text-[13px] leading-[1.7] whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
              {section.content}
            </div>
          </div>

          {section.data_points && section.data_points.length > 0 && (
            <div className="border-t" style={{ borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
                {section.data_points.map((dp, j) => (
                  <div key={j} className="px-4 py-2.5" style={{ background: "var(--bg)" }}>
                    <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      {dp.label}
                    </div>
                    <div className="text-[13px] font-mono mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>
                      {dp.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
