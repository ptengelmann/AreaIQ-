import type { Metadata } from "next";
import AboutClient from "./client";

export const metadata: Metadata = {
  title: "About | AreaIQ",
  description: "The story behind AreaIQ. Transparent, deterministic area scoring using 7 live UK data sources. Founded by Pedro Serapiao.",
  openGraph: {
    title: "About | AreaIQ",
    description: "The story behind AreaIQ. Transparent, deterministic area scoring using 7 live UK data sources.",
    type: "website",
    url: "https://www.area-iq.co.uk/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "About | AreaIQ", description: "The story behind AreaIQ. Transparent, deterministic area scoring." },
  alternates: { canonical: "https://www.area-iq.co.uk/about" },
};

export default function About() {
  return <AboutClient />;
}
