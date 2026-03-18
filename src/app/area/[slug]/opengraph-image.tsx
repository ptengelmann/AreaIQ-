import { ImageResponse } from "next/og";
import areasJson from "@/data/areas.json";
import type { AreaData } from "@/data/area-types";

const AREAS = areasJson as Record<string, AreaData>;

export const runtime = "edge";
export const alt = "AreaIQ Area Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getColor(score: number) {
  if (score >= 70) return "#00ff88";
  if (score >= 45) return "#ffb700";
  return "#ff4444";
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = AREAS[slug];

  if (!area) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", color: "#e4e4e8", fontFamily: "monospace", fontSize: "32px" }}>
          Area not found
        </div>
      ),
      { ...size }
    );
  }

  const scoreColor = getColor(area.overallScore);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "#09090b",
          fontFamily: "monospace",
        }}
      >
        {/* Top: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#e4e4e8", letterSpacing: "-0.5px" }}>
            AREA
          </span>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#00ff88", letterSpacing: "-0.5px" }}>
            IQ
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#555",
              border: "1px solid #1c1c22",
              padding: "3px 8px",
              marginLeft: "4px",
              background: "#0f0f12",
            }}
          >
            AREA REPORT
          </span>
        </div>

        {/* Middle: Area name + score */}
        <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
          {/* Left: Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
            <div style={{ fontSize: "48px", fontWeight: 600, color: "#e4e4e8", lineHeight: 1.1, letterSpacing: "-1px" }}>
              {area.name}
            </div>
            <div style={{ fontSize: "18px", color: "#71717a" }}>
              {area.region}
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
              {area.dimensions.slice(0, 5).map((dim) => (
                <div key={dim.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#555", letterSpacing: "1px" }}>
                    {dim.label.toUpperCase().replace("&", "+")}
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: getColor(dim.score) }}>
                    {dim.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Score ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: `4px solid ${scoreColor}`,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "56px", fontWeight: 700, color: scoreColor }}>
              {area.overallScore}
            </span>
            <span style={{ fontSize: "12px", color: "#555", letterSpacing: "1.5px", marginTop: "-4px" }}>
              / 100
            </span>
          </div>
        </div>

        {/* Bottom: Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", color: "#555", letterSpacing: "1px" }}>POPULATION</span>
            <span style={{ fontSize: "16px", color: "#71717a" }}>{area.population}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", color: "#555", letterSpacing: "1px" }}>AVG PROPERTY</span>
            <span style={{ fontSize: "16px", color: "#71717a" }}>{area.avgPropertyPrice}</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff88" }} />
            <span style={{ fontSize: "14px", color: "#71717a" }}>area-iq.co.uk</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
