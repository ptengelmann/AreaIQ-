import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "AreaIQ | UK Area Intelligence Reports",
  description: "AI-powered UK area intelligence. Enter any postcode, get a scored report across safety, transport, schools, and amenities.",
  openGraph: {
    title: "AreaIQ | UK Area Intelligence Reports",
    description: "Enter any UK postcode, get a scored intelligence report in seconds. Safety, transport, schools, amenities, and environment.",
    type: "website",
    url: "https://www.area-iq.co.uk",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "AreaIQ | UK Area Intelligence Reports", description: "Enter any UK postcode, get a scored intelligence report in seconds." },
  alternates: { canonical: "https://www.area-iq.co.uk" },
};

function WebSiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AreaIQ",
          url: "https://www.area-iq.co.uk",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.area-iq.co.uk/report?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <WebSiteJsonLd />
      <HomeClient />
    </>
  );
}
