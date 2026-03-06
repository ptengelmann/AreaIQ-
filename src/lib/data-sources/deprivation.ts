export interface DeprivationData {
  lsoa_code: string;
  lsoa_name: string;
  local_authority: string;
  imd_rank: number;
  imd_decile: number;
}

const TOTAL_LSOAS = 32844;

export async function getDeprivationData(lsoa: string): Promise<DeprivationData | null> {
  if (!lsoa || !lsoa.startsWith("E")) return null; // England only for IMD 2019

  try {
    const url = new URL(
      "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Index_of_Multiple_Deprivation_Dec_2019_Lookup_in_England_2022/FeatureServer/0/query"
    );
    url.searchParams.set("where", `LSOA11CD='${lsoa}'`);
    url.searchParams.set("outFields", "*");
    url.searchParams.set("f", "json");

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;

    const attrs = data.features[0].attributes;
    const rank = attrs.IMD19;
    if (!rank) return null;

    return {
      lsoa_code: attrs.LSOA11CD,
      lsoa_name: attrs.LSOA11NM || "",
      local_authority: attrs.LAD19NM || "",
      imd_rank: rank,
      imd_decile: Math.ceil((rank / TOTAL_LSOAS) * 10),
    };
  } catch {
    return null;
  }
}

export function formatDeprivationForPrompt(data: DeprivationData): string {
  const percentile = ((data.imd_rank / TOTAL_LSOAS) * 100).toFixed(0);
  const decileDesc =
    data.imd_decile <= 3
      ? "high deprivation"
      : data.imd_decile <= 7
        ? "moderate deprivation"
        : "low deprivation";

  return [
    `DEPRIVATION DATA (Source: MHCLG Index of Multiple Deprivation 2019):`,
    `LSOA: ${data.lsoa_name} (${data.lsoa_code})`,
    `Local Authority: ${data.local_authority}`,
    `IMD Rank: ${data.imd_rank.toLocaleString()} out of ${TOTAL_LSOAS.toLocaleString()} (${percentile}th percentile)`,
    `IMD Decile: ${data.imd_decile} out of 10 (1 = most deprived 10%, 10 = least deprived 10%) — ${decileDesc}`,
    ``,
    `Interpretation: This LSOA is in the ${decileDesc} category. A rank of ${data.imd_rank.toLocaleString()} means it is less deprived than ${((data.imd_rank / TOTAL_LSOAS) * 100).toFixed(1)}% of neighbourhoods in England.`,
  ].join("\n");
}
