# AreaIQ SEO Audit — March 2026

**Overall Score: 7/10**

The foundation is solid (metadata, canonicals, JSON-LD, sitemap, semantic HTML). The gaps are in missing verification tags, area pages not statically generated, encoding bugs, and missed structured data opportunities. Fixing P0 and P1 items would bring this to 9/10.

---

## P0 — Critical (do first)

### ~~1. No Google Search Console verification tag~~ DONE
~~Cannot monitor indexing, crawl errors, or search performance without this.~~
Already verified via DNS. Confirmed in GSC Settings > Ownership verification.

### ~~2. Area pages missing `generateStaticParams`~~ DONE
Added `generateStaticParams()` to `src/app/area/[slug]/page.tsx` returning all 32 slugs from the AREAS object. Build now shows all area pages as SSG (pre-rendered static HTML).

### 3. Encoding corruption in area seed data
~20 area pages show `Â£` instead of `£` in property prices. Visible to users and crawlers.
**Fix:** Find and replace all `Â£` with `£` in `src/app/area/[slug]/page.tsx`.

---

## P1 — Important (do this week)

### 4. `/report` page missing from sitemap
The core product entry point is not in the sitemap.
**Fix:** Add to `src/app/sitemap.ts`.

### 5. Auth/utility pages not blocked from indexing
`/verify`, `/forgot-password`, `/reset-password`, `/api-usage` waste crawl budget.
**Fix:** Add `robots: { index: false }` metadata to these pages. Add to robots.txt disallow list.

### 6. Missing canonical URL on `report/[id]` pages
Most shared pages on the site have no canonical. Potential duplicate content.
**Fix:** Add `alternates: { canonical }` to `src/app/report/[id]/page.tsx` metadata.

### 7. No `Organization` JSON-LD
Helps Google Knowledge Graph. Should include name, url, logo, contactPoint.
**Fix:** Add to `src/app/layout.tsx` alongside existing SoftwareApplication schema.

### 8. No `WebSite` schema with `SearchAction` on homepage
Enables sitelinks search box in Google results.
**Fix:** Add `WebSite` JSON-LD to the homepage.

### 9. Homepage meta description too long (165 chars)
Will be truncated in SERPs. Should be under 155.
**Fix:** Trim description in `src/app/page.tsx:6`.

### 10. No links to area pages from homepage
32 SEO pages are orphaned from main navigation. Only linked from other area pages.
**Fix:** Add an "Explore UK Areas" section on the landing page linking to area pages.

### 11. No dynamic OG images for area/blog pages
All pages share the same generic OG image. Dynamic images with city name + score would dramatically improve social CTR.
**Fix:** Create `src/app/area/[slug]/opengraph-image.tsx` and `src/app/blog/[slug]/opengraph-image.tsx`.

### 12. Area pages still showing IMD 2019 data
Seed data was not re-generated after the IMD 2025 upgrade.
**Fix:** Re-run batch seed script with updated data.

### 13. Add Bing Webmaster verification tag
**Fix:** Add `msvalidate.01` meta tag to `src/app/layout.tsx`.

---

## P2 — Nice to Have

### 14. Change `SoftwareApplication` to `WebApplication` in root JSON-LD
More accurate schema type for a browser-based SaaS.

### 15. Add apple touch icon (180x180)
Create `src/app/apple-icon.tsx` for iOS bookmark icons.

### 16. Add `BreadcrumbList` JSON-LD
Visual breadcrumbs exist but no structured data. Helps rich snippets.

### 17. BlogPosting missing `image` and `dateModified`
Google recommends both for article rich results. Add to `src/app/blog/[slug]/page.tsx`.

### 18. Changelog is client component (content invisible to crawlers)
Content only renders client-side. Crawlers see empty body.
**Fix:** Convert back to server component or use SSR.

### 19. Add `hreflang="en-gb"` tag
Signals UK audience to search engines. Optional since UK-only.

### 20. Duplicate metadata in layout vs page
`about/layout.tsx` and `about/page.tsx` both export metadata. Same for `business/`. Remove layout exports.

### 21. Use static `lastModified` dates in sitemap
Currently `new Date()` on every entry — misleading to crawlers.

### 22. Add `geo` coordinates to area page `Place` JSON-LD
Richer structured data for location-based results.

### 23. Add pricing structured data
`Offer` schema on pricing page for rich snippets.

### 24. Cross-link blog posts to area pages
Blog content about UK areas should link to relevant `/area/X` pages.

### 25. Fix `areaType: "suburban"` on all areas
London shows as "suburban" in seed data. Should be "urban".

### 26. Add `manifest.json` / PWA setup
Basic PWA metadata for mobile experience.

---

## What's Already Good

- Every public page has canonical URLs, OG tags, Twitter cards
- Proper heading hierarchy (single h1, semantic h2/h3)
- Semantic HTML (main, nav, section, article, header)
- FAQPage JSON-LD on help page
- BlogPosting JSON-LD on blog posts
- Place JSON-LD on area pages
- Sitemap with all 32 areas + 5 blog posts
- Robots.txt blocking app/dashboard routes
- Proper font loading via next/font (no render-blocking)
- Custom 404 page with correct status code
