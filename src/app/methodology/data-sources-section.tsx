import { Section } from "./section";

const DATA_SOURCES = [
  {
    name: "Police.uk",
    provider: "Home Office",
    radius: "1 mile",
    data: "Street-level crime incidents from the last 3 months, broken down by category (theft, violence, burglary, etc.). Includes monthly trend data for direction-of-travel analysis.",
  },
  {
    name: "ONS / IMD 2025",
    provider: "MHCLG via ArcGIS",
    radius: "LSOA boundary",
    data: "Index of Multiple Deprivation. Ranks 33,755 Lower Super Output Areas across income, employment, health, education, and living environment. Decile 1 = most deprived, decile 10 = least deprived.",
  },
  {
    name: "OpenStreetMap",
    provider: "Overpass API",
    radius: "500m to 2km",
    data: "Nearby amenities: schools within 1.5km, food and shops within 1km, transport stations within 2km, bus stops within 500m, parks and healthcare facilities.",
  },
  {
    name: "Environment Agency",
    provider: "Defra",
    radius: "3km / 5km",
    data: "Flood risk zones within 3km, active flood warnings within 5km, and identified rivers at risk. Data is fetched live per request.",
  },
  {
    name: "Postcodes.io",
    provider: "ONS / Royal Mail",
    radius: "Point lookup",
    data: "Geocoding (latitude/longitude), LSOA code and name, local authority, ward, constituency, and region. Acts as the entry point for all other lookups.",
  },
  {
    name: "HM Land Registry",
    provider: "Price Paid Data",
    radius: "Postcode district",
    data: "Actual sold prices from the last 12 months via SPARQL query. Median and mean prices, year-on-year change, property type breakdown (detached, semi, terraced, flat), tenure split, and price range.",
  },
  {
    name: "Ofsted",
    provider: "Department for Education",
    radius: "1.5km",
    data: "School inspection ratings (Outstanding, Good, Requires Improvement, Inadequate). England only.",
  },
];

export function DataSourcesSection() {
  return (
    <Section id="data-sources" title="Data Sources">
      <p
        className="text-[13px] mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Every report is built from 7 live UK government and open data
        sources, fetched in parallel at the time of request. No cached
        data. No estimates. No surveys.
      </p>
      <div
        className="border"
        style={{ borderColor: "var(--border)" }}
      >
        {DATA_SOURCES.map((source, i) => (
          <div
            key={source.name}
            className={`px-5 py-4 ${
              i < DATA_SOURCES.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: "var(--border)",
              background:
                i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg)",
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="text-[13px] font-mono font-semibold"
                style={{ color: "var(--neon-green)" }}
              >
                {source.name}
              </span>
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--text-tertiary)" }}
              >
                {source.provider}
              </span>
              <span
                className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5"
                style={{
                  color: "var(--text-tertiary)",
                  background: "var(--bg-active)",
                }}
              >
                {source.radius}
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {source.data}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
