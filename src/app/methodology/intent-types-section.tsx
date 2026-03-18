import { Section } from "./section";

const INTENT_DIMENSIONS = [
  {
    intent: "moving",
    label: "Moving",
    desc: "Residential relocation",
    dimensions: ["Safety", "Schools", "Transport", "Amenities", "Cost of Living"],
  },
  {
    intent: "business",
    label: "Business",
    desc: "Commercial viability",
    dimensions: ["Foot Traffic", "Competition", "Transport", "Spending Power", "Commercial Costs"],
  },
  {
    intent: "investing",
    label: "Investing",
    desc: "Property investment",
    dimensions: ["Price Growth", "Rental Yield", "Regeneration", "Tenant Demand", "Risk Factors"],
  },
  {
    intent: "research",
    label: "Research",
    desc: "General area profile",
    dimensions: ["Safety", "Transport", "Amenities", "Demographics", "Environment"],
  },
];

export function IntentTypesSection() {
  return (
    <Section id="intent-types" title="Intent Types & Dimension Weights">
      <p
        className="text-[13px] mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        The intent determines which dimensions are scored and how they
        are weighted. Different use cases care about different things.
        Moving prioritises safety and schools. Business prioritises foot
        traffic and spending power. Weights are calibrated internally
        and are not published.
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-px"
        style={{ background: "var(--border)" }}
      >
        {INTENT_DIMENSIONS.map((item) => (
          <div
            key={item.intent}
            className="p-5"
            style={{ background: "var(--bg-elevated)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <code
                className="text-[12px] font-mono font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {item.intent}
              </code>
              <span
                className="text-[10px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                &middot; {item.desc}
              </span>
            </div>
            <div className="space-y-1.5">
              {item.dimensions.map((d) => (
                <div
                  key={d}
                  className="flex items-center gap-2"
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--neon-green)", opacity: 0.6 }}
                  />
                  <span
                    className="text-[11px] font-mono"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
