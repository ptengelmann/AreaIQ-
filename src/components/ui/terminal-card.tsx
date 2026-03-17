interface TerminalCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export function TerminalCard({ children, className = "", padding = "p-5" }: TerminalCardProps) {
  return (
    <div
      className={`border ${padding} ${className}`}
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}

interface TerminalCardHeaderProps {
  children: React.ReactNode;
}

export function TerminalCardHeader({ children }: TerminalCardHeaderProps) {
  return (
    <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
      {children}
    </div>
  );
}
