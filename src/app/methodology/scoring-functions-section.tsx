import {
  Shield,
  Train,
  GraduationCap,
  Store,
  Users,
  TreePine,
  Scale,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { Section } from "./section";

const SCORING_FUNCTIONS = [
  {
    icon: Shield,
    label: "Safety",
    intents: "Moving, Research",
    explanation:
      "Analyses 3 months of police.uk crime data using a non-linear curve that penalises high-crime areas more sharply. Adjusts for violent crime concentration and month-on-month trends. Areas with rising crime are penalised; areas with falling crime are rewarded.",
  },
  {
    icon: Train,
    label: "Transport",
    intents: "Moving, Business, Research",
    explanation:
      "Measures rail/tube stations and bus stops with diminishing returns for each additional station. Combines heavy rail connectivity with local bus coverage into a single accessibility score. Benchmarked against area type (urban, suburban, rural).",
  },
  {
    icon: GraduationCap,
    label: "Schools",
    intents: "Moving",
    explanation:
      "Counts schools and educational facilities nearby using a diminishing returns curve. Having at least one good school matters more than having many. Benchmarks adjust for area type so rural areas are not penalised for fewer institutions.",
  },
  {
    icon: Store,
    label: "Amenities",
    intents: "Moving, Research",
    explanation:
      "A weighted composite across five categories: education, food and drink, healthcare, retail, and green spaces. Each category is normalised against area-type benchmarks and combined into a single convenience score.",
  },
  {
    icon: Users,
    label: "Demographics",
    intents: "Research",
    explanation:
      "Derived from government deprivation indices (IMD for England, WIMD for Wales, SIMD for Scotland). Maps the official decile ranking to a score reflecting the socioeconomic profile of the neighbourhood, including the LSOA's national rank and percentile position.",
  },
  {
    icon: TreePine,
    label: "Environment",
    intents: "Moving, Research",
    explanation:
      "Combines flood risk zones, active flood warnings, and green space availability. Areas with no flood risk and good park access score highest. Active warnings have significant negative impact. Data from the Environment Agency and OpenStreetMap.",
  },
  {
    icon: Scale,
    label: "Cost of Living",
    intents: "Moving",
    explanation:
      "Uses Land Registry sold prices as the primary input. When price data is available, scores are based on the ratio of local median prices to the national median. Falls back to deprivation data as a proxy when transaction data is unavailable.",
  },
];

const BUSINESS_SCORING = [
  {
    label: "Foot Traffic",
    explanation:
      "Combines transport connectivity with commercial activity density. Areas with strong rail, bus, and retail presence indicate higher natural footfall. Both components are weighted and capped to prevent outliers.",
  },
  {
    label: "Competition",
    explanation:
      "Measures commercial saturation by counting food, drink, and retail venues nearby, then inverts the count. Lower competition density scores higher. Useful for identifying underserved areas with unmet demand.",
  },
  {
    label: "Spending Power",
    explanation:
      "Derived from deprivation indices as a proxy for local disposable income. Less deprived areas indicate higher average spending power. Correlates with footfall quality, not just volume.",
  },
  {
    label: "Commercial Costs",
    explanation:
      "Uses Land Registry property values as a proxy for commercial rents and overheads. Higher local property prices correlate with higher commercial costs, resulting in a lower score. Falls back to deprivation data when price data is unavailable.",
  },
];

const INVESTING_SCORING = [
  {
    label: "Price Growth",
    explanation:
      "When Land Registry data is available, scores are based on real year-on-year price changes. Moderate growth scores highest; sharp declines and flat markets score lower. Falls back to deprivation-based growth potential estimates when transaction data is unavailable.",
  },
  {
    label: "Rental Yield",
    explanation:
      "Uses Land Registry median prices as the yield denominator. Lower property values indicate higher potential gross yields. Adjusts upward for strong local amenities and transport that drive tenant demand. Falls back to deprivation data when price data is unavailable.",
  },
  {
    label: "Regeneration",
    explanation:
      "Scores areas by development potential. Higher-deprivation areas with good transport links score highest, indicating opportunity for uplift. Already-developed premium areas score lower. Infrastructure investment is a key multiplier.",
  },
  {
    label: "Tenant Demand",
    explanation:
      "A composite of transport connectivity, local amenities, bus coverage, and commercial activity. Areas with strong infrastructure and varied amenities attract more tenants, driving occupancy and reducing void periods.",
  },
  {
    label: "Risk Factors",
    explanation:
      "Combines crime and environmental risk into a single downside metric. Low crime and no flood risk produce a high score. Areas with active flood warnings or elevated crime see significant score reductions.",
  },
];

export function ScoringFunctionsSection() {
  return (
    <Section id="scoring" title="How Each Score Is Calculated">
      <p
        className="text-[13px] mb-6 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Each dimension has a dedicated scoring function. Inputs go in,
        a number between 0 and 100 comes out. No randomness. No
        AI-generated numbers. Below is a plain-English breakdown of
        every function.
      </p>

      {/* Core dimensions */}
      <div
        className="text-[9px] font-mono uppercase tracking-wider mb-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        Core Dimensions
      </div>
      <div
        className="border mb-8"
        style={{ borderColor: "var(--border)" }}
      >
        {SCORING_FUNCTIONS.map((fn, i) => (
          <div
            key={fn.label}
            className={`px-5 py-4 ${
              i < SCORING_FUNCTIONS.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: "var(--border)",
              background:
                i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <fn.icon
                size={14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                className="text-[13px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {fn.label}
              </span>
              <span
                className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 ml-1"
                style={{
                  color: "var(--text-tertiary)",
                  background: "var(--bg-active)",
                }}
              >
                {fn.intents}
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {fn.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Business-specific */}
      <div
        className="text-[9px] font-mono uppercase tracking-wider mb-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        Business Intent: Derived Dimensions
      </div>
      <p
        className="text-[12px] mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Business reports use derived scores that combine transport,
        amenity, and deprivation data into commercially relevant
        metrics.
      </p>
      <div
        className="border mb-8"
        style={{ borderColor: "var(--border)" }}
      >
        {BUSINESS_SCORING.map((fn, i) => (
          <div
            key={fn.label}
            className={`px-5 py-4 ${
              i < BUSINESS_SCORING.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: "var(--border)",
              background:
                i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                size={14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                className="text-[13px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {fn.label}
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {fn.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Investing-specific */}
      <div
        className="text-[9px] font-mono uppercase tracking-wider mb-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        Investing Intent: Derived Dimensions
      </div>
      <p
        className="text-[12px] mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Investing reports combine deprivation data, transport
        connectivity, crime statistics, and flood risk into
        investment-focused metrics.
      </p>
      <div
        className="border"
        style={{ borderColor: "var(--border)" }}
      >
        {INVESTING_SCORING.map((fn, i) => (
          <div
            key={fn.label}
            className={`px-5 py-4 ${
              i < INVESTING_SCORING.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: "var(--border)",
              background:
                i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Gauge
                size={14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                className="text-[13px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {fn.label}
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {fn.explanation}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
