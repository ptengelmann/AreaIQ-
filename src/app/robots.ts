import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/dashboard", "/settings", "/compare"],
      },
    ],
    sitemap: "https://www.area-iq.co.uk/sitemap.xml",
  };
}
