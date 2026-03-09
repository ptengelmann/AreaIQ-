import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function Pulse({ width, height = "h-4" }: { width: string; height?: string }) {
  return (
    <div
      className={`${width} ${height} animate-pulse`}
      style={{ background: "var(--border)", borderRadius: "2px" }}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar breadcrumbs={[{ label: "Dashboard" }]} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
        {/* Plan & Usage skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-6" style={{ background: "var(--border)" }}>
          <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
            <Pulse width="w-20" height="h-3" />
            <div className="mt-3">
              <Pulse width="w-24" height="h-6" />
            </div>
          </div>
          <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
            <Pulse width="w-24" height="h-3" />
            <div className="mt-3 flex items-center gap-3">
              <Pulse width="w-16" height="h-6" />
              <Pulse width="w-full" height="h-1.5" />
            </div>
          </div>
        </div>

        {/* Stats strip skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-6" style={{ background: "var(--border)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3" style={{ background: "var(--bg-elevated)" }}>
              <Pulse width="w-20" height="h-2.5" />
              <div className="mt-2">
                <Pulse width="w-12" height="h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Heading skeleton */}
        <div className="mb-4">
          <Pulse width="w-32" height="h-6" />
          <div className="mt-2">
            <Pulse width="w-40" height="h-3" />
          </div>
        </div>

        {/* Search bar skeleton */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
          <Pulse width="w-full sm:w-64" height="h-8" />
          <div className="flex items-center gap-2">
            <Pulse width="w-24" height="h-8" />
            <Pulse width="w-14" height="h-8" />
            <Pulse width="w-14" height="h-8" />
            <Pulse width="w-14" height="h-8" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="hidden md:block border" style={{ borderColor: "var(--border)" }}>
          <div
            className="px-5 py-2.5 border-b"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="flex items-center gap-8">
              <Pulse width="w-4" height="h-4" />
              <Pulse width="w-20" height="h-3" />
              <Pulse width="w-16" height="h-3" />
              <Pulse width="w-12" height="h-3" />
              <Pulse width="w-12" height="h-3" />
              <Pulse width="w-24" height="h-3" />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="px-5 py-3 border-b flex items-center gap-8"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <Pulse width="w-4" height="h-4" />
              <Pulse width="w-40" height="h-4" />
              <Pulse width="w-16" height="h-3" />
              <Pulse width="w-8" height="h-4" />
              <Pulse width="w-14" height="h-3" />
              <Pulse width="w-20" height="h-3" />
            </div>
          ))}
        </div>

        {/* Mobile card skeleton */}
        <div className="md:hidden space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border p-4"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <Pulse width="w-40" height="h-4" />
                <Pulse width="w-10" height="h-5" />
              </div>
              <div className="flex items-center gap-3">
                <Pulse width="w-16" height="h-3" />
                <Pulse width="w-14" height="h-3" />
                <div className="ml-auto">
                  <Pulse width="w-16" height="h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
