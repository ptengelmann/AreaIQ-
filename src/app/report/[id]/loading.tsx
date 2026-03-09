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

export default function ReportLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar breadcrumbs={[{ label: "Loading..." }]} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-[960px]">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Pulse width="w-16" height="h-5" />
              <Pulse width="w-20" height="h-5" />
              <Pulse width="w-24" height="h-4" />
            </div>
            <Pulse width="w-64" height="h-7" />
            <div className="mt-3 space-y-2">
              <Pulse width="w-full" height="h-3" />
              <Pulse width="w-3/4" height="h-3" />
            </div>
          </div>

          {/* Score panel skeleton */}
          <div
            className="border mb-3"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="px-5 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <Pulse width="w-28" height="h-3" />
              <Pulse width="w-32" height="h-3" />
            </div>
            <div className="p-5 flex flex-col lg:flex-row items-center gap-6">
              {/* Score ring placeholder */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div
                  className="rounded-full animate-pulse"
                  style={{ width: 130, height: 130, background: "var(--border)" }}
                />
                <Pulse width="w-20" height="h-3" />
              </div>
              {/* Radar chart placeholder */}
              <div className="flex-1 flex justify-center">
                <div
                  className="animate-pulse"
                  style={{ width: 200, height: 200, background: "var(--border)", borderRadius: "50%" }}
                />
              </div>
            </div>
          </div>

          {/* Dimension breakdown skeleton */}
          <div
            className="border mb-6"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <Pulse width="w-36" height="h-3" />
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <Pulse width="w-32" height="h-3" />
                    <Pulse width="w-8" height="h-4" />
                  </div>
                  <Pulse width="w-full" height="h-1.5" />
                  <div className="mt-2">
                    <Pulse width="w-full" height="h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section skeletons */}
          <div className="space-y-2 mb-6">
            <Pulse width="w-28" height="h-3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border px-5 py-3"
                style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
              >
                <div className="flex items-center gap-3">
                  <Pulse width="w-6" height="h-4" />
                  <Pulse width="w-48" height="h-4" />
                  <div className="ml-auto">
                    <Pulse width="w-20" height="h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
