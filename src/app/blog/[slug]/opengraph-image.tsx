import { ImageResponse } from "next/og";
import { BLOG_POSTS } from "../posts";

export const runtime = "edge";
export const alt = "AreaIQ Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", color: "#e4e4e8", fontFamily: "monospace", fontSize: "32px" }}>
          Post not found
        </div>
      ),
      { ...size }
    );
  }

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
        {/* Top: Logo + Blog badge */}
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
            BLOG
          </span>
        </div>

        {/* Middle: Title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "44px", fontWeight: 600, color: "#e4e4e8", lineHeight: 1.15, letterSpacing: "-1px", maxWidth: "900px" }}>
            {post.title}
          </div>
          <div style={{ fontSize: "18px", color: "#71717a", lineHeight: 1.5, maxWidth: "750px" }}>
            {post.description}
          </div>
        </div>

        {/* Bottom: Meta + domain */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#555" }}>{post.date}</span>
            <span style={{ fontSize: "13px", color: "#333" }}>|</span>
            <span style={{ fontSize: "13px", color: "#555" }}>{post.readTime} read</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "10px",
                  color: "#00ff88",
                  border: "1px solid #1a3a2a",
                  padding: "2px 8px",
                  background: "#0a1a12",
                  letterSpacing: "0.5px",
                }}
              >
                {tag.toUpperCase()}
              </span>
            ))}
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
