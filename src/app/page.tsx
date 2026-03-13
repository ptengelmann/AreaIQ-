import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "AreaIQ | UK Area Intelligence Reports",
  description: "AI-powered area intelligence for the UK. Enter any postcode, get a scored report across safety, transport, schools, amenities, and environment. Powered by 5 live data sources.",
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

export default function Home() {
  return <HomeClient />;
}
