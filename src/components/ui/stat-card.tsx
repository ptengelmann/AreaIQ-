import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ElementType;
  subtext?: string;
}

export function StatCard({ label, value, icon: Icon, subtext }: StatCardProps) {
  return (
    <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={12} style={{ color: "var(--text-tertiary)" }} />}
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </span>
      </div>
      <span className="text-xl font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {subtext && (
        <span className="block text-[10px] font-mono mt-1" style={{ color: "var(--text-tertiary)" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}
