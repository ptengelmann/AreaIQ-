# AreaIQ — Product Blueprint

## Company

**Name:** AreaIQ
**Tagline:** Know any area. Instantly.
**Founded:** 2026

---

## Vision

A world where understanding any area on Earth is as easy as asking a question.

## Mission

To build the definitive AI-powered area intelligence platform that makes location decisions data-driven, instant, and accessible to everyone — from a solo founder choosing where to open a shop to an enterprise evaluating 500 sites at once.

## The Problem

Every day, thousands of people and businesses need to deeply understand an area — investors, franchises, families relocating, developers assessing sites, marketers targeting regions. They all do the same thing: open 15 browser tabs, Google for hours, paste into spreadsheets, and still miss critical data. The tools that exist are either:

- Too expensive (Placer.ai, SafeGraph: $20K-100K/yr)
- Too shallow (Numbeo, AreaVibes: user-submitted, static, surface-level)
- Too generic (Google Maps: shows what's there, not whether it's right for you)
- Too unstructured (asking ChatGPT: wall of text, no scoring, hallucinations, no persistence)

Nobody has built the **intent-driven, scored, structured, API-first** area intelligence platform.

## The Solution

AreaIQ is an AI area research agent. You give it a location and an intent — and it researches, scores, and delivers a structured intelligence report in seconds.

The same area gets a completely different report depending on your purpose. "London E1 for opening a coffee shop" is a fundamentally different question than "London E1 for raising a family." AreaIQ understands this.

---

## Core Differentiators

1. **Intent-driven reports.** The same location produces different intelligence based on what you need. Not generic data — targeted insight.
2. **Structured scoring.** AreaIQ Score (composite) + sub-scores (safety, amenities, competition, transport, demographics). Comparable across areas. Not a wall of AI text.
3. **Persistent and indexable.** Every report is a page — shareable, comparable, bookmarkable. Builds a living atlas of area intelligence that compounds via SEO.
4. **API-first.** Any property platform, CRM, relocation service, or franchise consultant can embed AreaIQ intelligence into their product.
5. **Real data, not hallucinations.** The AI agent pulls from verified public data sources (census, crime APIs, Google Places, OSM, school ratings, planning data) and synthesises — it doesn't guess.

---

## Strategic Themes

### Theme 1: Agent-First Intelligence
The AI agent researches in real-time. No stale databases, no manual updates. The intelligence is always current because the agent pulls live data on every request.

### Theme 2: Intent-Driven Reports
Reports shaped by purpose. "Open a business" triggers competition analysis, foot traffic proxies, commercial rent data. "Move my family" triggers school quality, safety, parks, transport. Same area, different intelligence.

### Theme 3: Public Layer = Growth Engine
Free reports drive SEO, social sharing, and brand awareness. Every report is a landing page. Every neighbourhood is a keyword. The free tier is the marketing engine; paid tiers monetise power users and businesses.

### Theme 4: API as Ecosystem
Every report is an API call. Let property platforms, relocation companies, franchise consultants, CRMs, and insurance firms build on AreaIQ. Become the location intelligence infrastructure layer.

### Theme 5: Compounding Data Moat
Every query teaches the system. Which areas get researched most? What intents? What correlates with conversion? Over time, AreaIQ builds a proprietary dataset of location demand signals and quality benchmarks nobody else has.

---

## Outcomes

### Outcome 1: Location Intelligence Becomes Accessible
Any person or business can understand any area in seconds, not hours. No expensive consultants, no enterprise contracts, no manual research.

### Outcome 2: Area Data Becomes Structured and Comparable
For the first time, areas have a standardised intelligence format — scored, sectioned, comparable. You can put two neighbourhoods side-by-side and make a data-driven decision.

### Outcome 3: An Ecosystem Emerges
Third-party products embed AreaIQ. Contributors enhance reports. Custom templates serve niche industries. AreaIQ becomes infrastructure, not just an app.

### Outcome 4: Revenue Scales with Usage
API-first, usage-based billing means revenue grows linearly with adoption. Every integration, every embedded report, every enterprise deal adds recurring revenue.

---

## Product Roadmap

### V1 — MVP (Weeks 1-4)
**Goal:** Validate demand. Ship the simplest version that delivers real value.

- Single-page app: enter area + intent, get AI-generated area intelligence report
- Intent types: Moving / Opening a business / Investing / General research
- Report sections: Overview, Demographics, Safety, Amenities, Transport, Competition (for business intents), Schools (for family intents), AreaIQ Score
- Data sources: Census/ONS APIs, Google Places API, OpenStreetMap/Overpass, public crime data, school ratings
- Neon (Postgres + PostGIS) for storing reports and area data
- Basic auth (Clerk)
- Free tier: 3 reports/month. Pro: $49/month unlimited
- Clean, minimal UI. No gradients, no gimmicks.

**Key Results:**
- Ship within 14 days
- 1,000 free reports generated in first 30 days
- 50 paid signups by end of month 2
- Report generation < 30 seconds

### V2 — Comparison + API (Months 2-3)
**Goal:** Enable power users and B2B.

- Side-by-side area comparison (2-4 areas)
- Saved reports + report history per user
- Public API (REST) with API key management
- API documentation
- Embeddable report widget (iframe/JS snippet)
- Report sharing via URL (public link)
- Stripe billing for API usage (per-call pricing)
- Enhanced data: planning applications, business registrations, market trends

**Key Results:**
- 10 API customers by end of month 3
- 200 total paid users
- API response time < 10 seconds
- 5,000 indexed report pages (SEO)

### V3 — Ecosystem (Months 4-6)
**Goal:** Build the moat. Create lock-in.

- Custom report templates (users/experts create templates for specific industries)
- Batch area analysis (upload CSV of 100 postcodes, get scored report for each)
- Historical tracking: "How has this area changed since last quarter?"
- Integration partnerships (property portals, CRMs)
- Enhanced scoring model based on outcome data
- White-label option for enterprise
- Team accounts with shared report libraries

**Key Results:**
- 500 paid users
- 3 integration partnerships live
- $100K ARR
- First enterprise deal > $5K/month
- 50,000 indexed pages

### V4 — Platform (Months 6-12)
**Goal:** Become infrastructure.

- Report marketplace: domain experts publish and sell custom report types
- Data contributor network: local experts verify/enhance AI-generated reports
- Real-time area monitoring (alerts when something changes in an area you track)
- Multi-country expansion (US, UK, EU markets)
- Advanced analytics dashboard for enterprise
- AreaIQ Score becomes an industry standard reference

**Key Results:**
- $500K ARR
- 2,000+ paid users
- 20+ marketplace report templates
- Coverage across 3+ countries
- First data licensing deal

### V5 — Intelligence Network (Year 2+)
**Goal:** Category dominance.

- Predictive area intelligence ("This area will gentrify in 2-3 years based on signals X, Y, Z")
- Investment-grade area reports with financial modelling
- Government and municipal partnerships
- Real-time foot traffic integration
- AreaIQ Index: public, free quarterly report on area trends (PR/brand play)
- Series A to accelerate geographic expansion and enterprise sales

---

## Target Users

### B2C / Public (Free + Pro)
- People relocating (families, remote workers, expats)
- First-time property buyers researching neighbourhoods
- Small business owners choosing where to open
- Indie investors evaluating areas for buy-to-let
- Journalists and researchers

### B2B (API + Enterprise)
- Property platforms (embed area intelligence in listings)
- Relocation companies (area reports for employees moving)
- Franchise consultants (site selection for chains)
- Commercial real estate brokers (site assessment reports)
- Insurance companies (area risk scoring)
- Marketing agencies (geographic targeting intelligence)

---

## Revenue Model

| Tier | Price | Target |
|------|-------|--------|
| Free | $0 (3 reports/month) | Public, SEO, awareness |
| Pro | $49/month (unlimited reports) | Individuals, small investors, small business owners |
| API | $99/month + $0.10/call | Developers, small platforms |
| Business | $299/month (team seats, batch, saved) | Teams, agencies, consultants |
| Enterprise | $5,000+/month (white-label, custom, SLA) | Property portals, large firms |

---

## Unit Economics

- Cost per report (AI + APIs): ~$0.06-0.12
- Revenue per Pro user/month: $49
- Reports a Pro user generates/month: ~20-50
- Cost to serve a Pro user/month: ~$1.20-6.00
- Gross margin per Pro user: ~88-97%

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Database | Neon (Postgres + PostGIS) | Serverless, geospatial queries, free tier, scales |
| Backend | Next.js (API routes) | Full-stack in one repo, Vercel deployment |
| AI | Claude API (Sonnet) | Best reasoning for synthesis + structured output |
| Frontend | React (Next.js) | Fast, SEO-friendly with SSR |
| Auth | Clerk | Free tier, fast integration |
| Payments | Stripe | Industry standard |
| Data Sources | Census APIs, Google Places, OSM, crime APIs, school APIs | Mostly free, reliable |
| Hosting | Vercel | Free tier, auto-scaling |

---

## UI/UX Standards

- Clean, minimal, professional. No gradients. No rounded "friendly" design.
- Square or near-square buttons. Thin borders. Tight spacing.
- Monospaced elements for data/scores. Sans-serif for body text.
- Dark mode primary. Light mode secondary.
- No decorative illustrations. No AI-themed imagery. No bullshit.
- Data-dense where appropriate. Whitespace where it serves clarity.
- Think: Bloomberg terminal meets Linear meets Vercel dashboard.
- Every pixel earns its place.

---

## Competitive Landscape

| Competitor | What they do | AreaIQ advantage |
|-----------|-------------|-----------------|
| Placer.ai | Foot traffic analytics | 1000x cheaper, broader intelligence, self-serve |
| Numbeo | Crowdsourced city stats | AI-powered, intent-driven, structured, real-time |
| AreaVibes | Area livability scores | Deeper analysis, business intents, API, not just residential |
| Google Maps | Map + places | Not intelligence — just data. No scoring, no intent |
| ChatGPT/Claude | Can research areas | No structure, no persistence, no scoring, hallucination risk, no API |
| Zillow/Rightmove | Property + basic area data | Property-first not area-first. No business intelligence |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Data source APIs change or rate-limit | Cache aggressively, diversify sources, build fallbacks |
| AI costs spike with scale | Cache common area reports, use Haiku for simple queries, Sonnet for deep reports |
| Someone copies the concept | Speed + data moat + SEO moat + API integrations = switching cost |
| Report quality inconsistent | Structured prompts + validation layer + user feedback loop |
| Slow GTM / low demand | Free tier + SEO + content marketing costs near-zero; iterate fast |

---

*This is a living document. Updated as the product evolves.*
