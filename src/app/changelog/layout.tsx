import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | AreaIQ",
  description: "Product updates, new features, and improvements to AreaIQ. See what we ship, month by month.",
  openGraph: {
    title: "Changelog | AreaIQ",
    description: "Product updates, new features, and improvements to AreaIQ.",
    type: "article",
    url: "https://www.area-iq.co.uk/changelog",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Changelog | AreaIQ", description: "Product updates, new features, and improvements to AreaIQ." },
  alternates: { canonical: "https://www.area-iq.co.uk/changelog" },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
