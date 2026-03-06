import { sql } from "@/lib/db";
import { PLANS, PlanId } from "@/lib/stripe";

export async function getUserPlan(userId: string): Promise<PlanId> {
  const rows = await sql`
    SELECT plan FROM subscriptions
    WHERE user_id = ${userId} AND status = 'active'
  `;
  if (rows.length === 0) return "free";
  return rows[0].plan as PlanId;
}

export async function getMonthlyReportCount(userId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int as count FROM reports
    WHERE user_id = ${userId}
    AND created_at >= date_trunc('month', NOW())
  `;
  return rows[0].count;
}

export async function canGenerateReport(userId: string): Promise<{
  allowed: boolean;
  plan: PlanId;
  used: number;
  limit: number;
}> {
  const plan = await getUserPlan(userId);
  const used = await getMonthlyReportCount(userId);
  const limit = PLANS[plan].reportsPerMonth;

  return {
    allowed: used < limit,
    plan,
    used,
    limit,
  };
}

export async function getStripeCustomerId(userId: string): Promise<string | null> {
  const rows = await sql`
    SELECT stripe_customer_id FROM subscriptions
    WHERE user_id = ${userId}
  `;
  if (rows.length === 0) return null;
  return rows[0].stripe_customer_id as string;
}
