"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Mail, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          {sent ? (
            <div className="text-center">
              <div
                className="w-14 h-14 mx-auto mb-5 flex items-center justify-center"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                <Mail size={24} />
              </div>
              <h1 className="text-[22px] font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
                Check your email
              </h1>
              <p className="text-[13px] mb-1" style={{ color: "var(--text-secondary)" }}>
                If an account exists for
              </p>
              <p className="text-[13px] font-mono font-medium mb-6" style={{ color: "var(--accent)" }}>
                {email}
              </p>
              <div
                className="text-[11px] font-mono px-4 py-3 mb-6 border text-left"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)", color: "var(--text-tertiary)" }}
              >
                <p className="mb-1">1. Open the email from AreaIQ</p>
                <p className="mb-1">2. Click the password reset link</p>
                <p>3. Choose a new password and sign in</p>
              </div>
              <p className="text-[10px] font-mono mb-6" style={{ color: "var(--text-tertiary)" }}>
                Link expires in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
              <Link
                href="/sign-in"
                className="inline-flex h-9 px-6 items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
                style={{ background: "var(--text-primary)", color: "var(--bg)" }}
              >
                Back to sign in <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-[22px] font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
                  Reset your password
                </h1>
                <p className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full h-9 px-3 text-[13px] border"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className="text-[11px] font-mono px-3 py-2 border" style={{ color: "var(--neon-red)", borderColor: "var(--neon-red-dim)", background: "var(--neon-red-dim)" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full flex items-center justify-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide transition-colors cursor-pointer disabled:opacity-50"
                  style={{ background: "var(--text-primary)", color: "var(--bg)" }}
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : <>Send reset link <ArrowRight size={12} /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  <ArrowLeft size={11} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
