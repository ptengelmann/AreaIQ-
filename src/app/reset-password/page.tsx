"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-[380px] text-center">
        <div
          className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-[20px]"
          style={{ background: "var(--neon-red-dim)", color: "var(--neon-red)" }}
        >
          ✕
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Invalid reset link
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex h-10 px-6 items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          Request new link <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-[380px] text-center">
        <div
          className="w-14 h-14 mx-auto mb-5 flex items-center justify-center"
          style={{ background: "var(--neon-green-dim)", color: "var(--neon-green)" }}
        >
          <CheckCircle size={24} />
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Password updated
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--text-secondary)" }}>
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex h-9 px-6 items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          Sign in <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="mb-8 text-center">
        <h1 className="text-[22px] font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Choose a new password
        </h1>
        <p className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
          Must be at least 8 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full h-9 px-3 text-[13px] border"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-tertiary)" }}>
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={8}
            className="w-full h-9 px-3 text-[13px] border"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
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
          {loading ? <Loader2 size={13} className="animate-spin" /> : <>Reset password <ArrowRight size={12} /></>}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-tertiary)" }} />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
