export type Intent = "moving" | "business" | "investing" | "research";

export interface SubScore {
  label: string;
  score: number;
  weight: number;
  summary: string;
  reasoning?: string;
}

export interface ReportSection {
  title: string;
  content: string;
  data_points?: { label: string; value: string }[];
}

export type AreaType = "urban" | "suburban" | "rural";

export interface DataFreshness {
  source: string;
  period: string;
  status: "live" | "recent" | "static";
}

export interface AreaReport {
  area: string;
  intent: Intent;
  areaiq_score: number;
  area_type?: AreaType;
  sub_scores: SubScore[];
  summary: string;
  sections: ReportSection[];
  recommendations: string[];
  data_sources?: string[];
  data_freshness?: DataFreshness[];
  generated_at: string;
}

export interface ReportRecord {
  id: string;
  area: string;
  intent: Intent;
  country: string;
  report: AreaReport;
  score: number;
  created_at: string;
}
