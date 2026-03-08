import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer({ maxWidth = "1200px" }: { maxWidth?: string }) {
  return (
    <footer className="border-t shrink-0" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto px-6 h-10 flex items-center justify-between" style={{ maxWidth }}>
        <Logo size="sm" variant="footer" />
        <div className="flex items-center gap-4">
          <Link href="/help" className="text-[10px] font-mono transition-colors hover:opacity-80" style={{ color: "var(--text-tertiary)" }}>
            Help
          </Link>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>
            Area intelligence, instantly.
          </span>
        </div>
      </div>
    </footer>
  );
}
