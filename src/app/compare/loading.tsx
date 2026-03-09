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

export default function CompareLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Compare" }]} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
        {/* Heading */}
        <div className="mb-6">
          <Pulse width="w-44" height="h-6" />
          <div className="mt-2">
            <Pulse width="w-72" height="h-3" />
          </div>
        </div>

        {/* Score overview skeleton */}
        <div className="border mb-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <div className="px-5 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <Pulse width="w-24" height="h-3" />
            <Pulse width="w-14" height="h-5" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div
                    className="rounded-full animate-pulse"
                    style={{ width: 80, height: 80, background: "var(--border)" }}
                  />
                  <Pulse width="w-32" height="h-5" />
                  <Pulse width="w-16" height="h-3" />
                  <Pulse width="w-48" height="h-2.5" />
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t flex justify-center" style={{ borderColor: "var(--border)" }}>
              <Pulse width="w-64" height="h-3" />
            </div>
          </div>
        </div>

        {/* Dimension breakdown skeleton */}
        <div className="border mb-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <div className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <Pulse width="w-36" height="h-3" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3 px-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <Pulse width="w-32" height="h-3" />
                <Pulse width="w-20" height="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Pulse width="w-20" height="h-2.5" />
                    <Pulse width="w-8" height="h-3" />
                  </div>
                  <Pulse width="w-full" height="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Pulse width="w-20" height="h-2.5" />
                    <Pulse width="w-8" height="h-3" />
                  </div>
                  <Pulse width="w-full" height="h-1.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report links skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border px-4 py-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <Pulse width="w-16" height="h-3" />
              <div className="mt-1">
                <Pulse width="w-32" height="h-4" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
