import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { getUserPlan, getMonthlyReportCount } from "@/lib/usage";
import { PLANS } from "@/lib/stripe";
import { DashboardClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reports | AreaIQ",
  description: "View your generated area intelligence reports.",
};

async function getUserReports(userId: string) {
  const rows = await sql`
    SELECT id, area, intent, score, created_at
    FROM reports
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    id: row.id as string,
    area: row.area as string,
    intent: row.intent as string,
    score: row.score as number,
    created_at: row.created_at as string,
  }));
}

async function getSavedAreas(userId: string) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS saved_areas (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL,
        postcode TEXT NOT NULL,
        label TEXT NOT NULL DEFAULT '',
        intent TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, postcode)
      )
    `;
    const rows = await sql`
      SELECT id, postcode, label, intent, created_at
      FROM saved_areas
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return rows.map((row) => ({
      id: row.id as string,
      postcode: row.postcode as string,
      label: (row.label as string) || "",
      intent: (row.intent as string) || null,
      created_at: row.created_at as string,
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const [reports, plan, used, savedAreas] = await Promise.all([
    getUserReports(userId),
    getUserPlan(userId),
    getMonthlyReportCount(userId),
    getSavedAreas(userId),
  ]);

  const planConfig = PLANS[plan];

  return (
    <DashboardClient
      reports={reports}
      plan={plan}
      planName={planConfig.name}
      used={used}
      limit={planConfig.reportsPerMonth}
      savedAreas={savedAreas}
    />
  );
}
