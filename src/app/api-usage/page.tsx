"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  Activity,
  Key,
  Clock,
  TrendingUp,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@/components/user-button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface DailyData {
  day: string;
  count: number;
}

interface ApiKeyInfo {
  id: string;
  key_preview: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

interface UsageData {
  totalRequests: number;
  requestsThisMonth: number;
  monthlyLimit: number;
  dailyData: DailyData[];
  lastRequestAt: string | null;
  keys: ApiKeyInfo[];
}

export default function ApiUsagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/keys/usage");
      if (res.status === 403) {
        router.push("/pricing");
        return;
      }
      if (!res.ok) {
        setError("Failed to load usage data");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (session?.user) {
      fetchUsage();
    }
  }, [session, fetchUsage]);

  if (status === "loading") return null;
  if (!session?.user) {
    router.push("/sign-in");
    return null;
  }

  const usagePercent = data
    ? Math.min((data.requestsThisMonth / data.monthlyLimit) * 100, 100)
    : 0;

  const maxDailyCount = data
    ? Math.max(...data.dailyData.map((d) => d.count), 1)
    : 1;

  function formatTimestamp(ts: string | null): string {
    if (!ts) return "Never";
    const d = new Date(ts);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDay(dayStr: string): string {
    const d = new Date(dayStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  // Determine usage bar color based on consumption
  function getUsageColor(): string {
    if (usagePercent >= 90) return "var(--neon-red)";
    if (usagePercent >= 70) return "var(--neon-amber)";
    return "var(--neon-green)";
  }

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "API Usage" },
        ]}
      >
        <Link
          href="/report"
          className="h-7 px-3 flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase tracking-wide transition-colors"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          <ArrowRight size={11} />
          App
        </Link>
        <UserButton />
      </Navbar>

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20">
            <Loader2
              size={16}
              className="animate-spin"
              style={{ color: "var(--text-tertiary)" }}
            />
            <span
              className="text-[11px] font-mono"
              style={{ color: "var(--text-tertiary)" }}
            >
              Loading usage data...
            </span>
          </div>
        ) : error ? (
          <div
            className="text-[11px] font-mono px-4 py-3"
            style={{
              color: "var(--neon-red)",
              background: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            {error}
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Total Requests"
                value={data.totalRequests.toLocaleString()}
                icon={<TrendingUp size={12} />}
              />
              <StatCard
                label="This Month"
                value={data.requestsThisMonth.toLocaleString()}
                icon={<Activity size={12} />}
                accent
              />
              <StatCard
                label="Monthly Limit"
                value={data.monthlyLimit.toLocaleString()}
                icon={<Key size={12} />}
              />
              <StatCard
                label="Last Request"
                value={
                  data.lastRequestAt
                    ? timeAgo(data.lastRequestAt)
                    : "No requests yet"
                }
                icon={<Clock size={12} />}
              />
            </div>

            {/* Usage Bar */}
            <div
              className="border"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="px-5 py-2.5 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-[9px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Monthly Consumption
                </span>
                <span
                  className="text-[11px] font-mono font-medium"
                  style={{ color: getUsageColor() }}
                >
                  {data.requestsThisMonth} / {data.monthlyLimit}
                </span>
              </div>
              <div className="px-5 py-4">
                <div
                  className="w-full h-3 relative overflow-hidden"
                  style={{ background: "var(--bg)" }}
                >
                  <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${usagePercent}%`,
                      background: getUsageColor(),
                      opacity: 0.85,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {usagePercent.toFixed(1)}% used
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {data.monthlyLimit - data.requestsThisMonth} remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Chart */}
            <div
              className="border"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="px-5 py-2.5 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-[9px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Requests Per Day (Last 30 Days)
                </span>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-end gap-[2px] h-[140px]">
                  {data.dailyData.map((d) => {
                    const heightPercent =
                      d.count > 0 ? (d.count / maxDailyCount) * 100 : 0;
                    const isToday =
                      d.day === new Date().toISOString().split("T")[0];
                    return (
                      <div
                        key={d.day}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full mb-1 px-2 py-1 text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                          style={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {formatDay(d.day)}: {d.count} request
                          {d.count !== 1 ? "s" : ""}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full min-h-[1px] transition-all duration-300"
                          style={{
                            height:
                              d.count > 0
                                ? `${Math.max(heightPercent, 3)}%`
                                : "1px",
                            background: isToday
                              ? "var(--neon-green)"
                              : d.count > 0
                                ? "var(--neon-green)"
                                : "var(--border)",
                            opacity: isToday ? 1 : d.count > 0 ? 0.6 : 0.3,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2">
                  <span
                    className="text-[9px] font-mono"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {data.dailyData.length > 0
                      ? formatDay(data.dailyData[0].day)
                      : ""}
                  </span>
                  <span
                    className="text-[9px] font-mono"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Today
                  </span>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div
              className="border"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="px-5 py-2.5 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-[9px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Active API Keys
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {data.keys.length} key{data.keys.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {data.keys.length === 0 ? (
                  <div className="px-5 py-6 text-center">
                    <p
                      className="text-[11px] font-mono"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      No API keys created yet
                    </p>
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-mono transition-colors hover:opacity-80"
                      style={{ color: "var(--neon-green)" }}
                    >
                      <BookOpen size={11} />
                      View API docs to get started
                    </Link>
                  </div>
                ) : (
                  data.keys.map((key) => (
                    <div
                      key={key.id}
                      className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Key
                          size={12}
                          style={{ color: "var(--text-tertiary)" }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[12px] font-mono font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {key.name}
                            </span>
                            <code
                              className="text-[10px] font-mono px-1.5 py-0.5"
                              style={{
                                color: "var(--text-tertiary)",
                                background: "var(--bg)",
                              }}
                            >
                              {key.key_preview}
                            </code>
                          </div>
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            Created {formatTimestamp(key.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:text-right">
                        <span
                          className="text-[10px] font-mono"
                          style={{
                            color: key.last_used_at
                              ? "var(--neon-green)"
                              : "var(--text-tertiary)",
                          }}
                        >
                          {key.last_used_at
                            ? `Last used ${timeAgo(key.last_used_at)}`
                            : "Never used"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/docs"
                className="flex-1 flex items-center justify-center gap-2 h-10 text-[11px] font-mono font-medium uppercase tracking-wide transition-all border hover:brightness-110"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                }}
              >
                <BookOpen size={12} />
                API Documentation
                <ExternalLink size={10} />
              </Link>
              <Link
                href="/settings"
                className="flex-1 flex items-center justify-center gap-2 h-10 text-[11px] font-mono font-medium uppercase tracking-wide transition-all border hover:brightness-110"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                }}
              >
                <Key size={12} />
                Manage Keys in Settings
              </Link>
            </div>
          </div>
        ) : null}
      </main>

      <Footer maxWidth="900px" />
    </div>
  );
}

// ── Helper Components ──

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="border px-4 py-3"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-elevated)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: "var(--text-tertiary)" }}>{icon}</span>
        <span
          className="text-[9px] font-mono uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </span>
      </div>
      <div
        className="text-[18px] font-mono font-semibold"
        style={{
          color: accent ? "var(--neon-green)" : "var(--text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
