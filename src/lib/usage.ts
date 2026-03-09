import { sql } from "@/lib/db";
import { PLANS, PlanId } from "@/lib/stripe";

const SUPERUSER_EMAILS = ["ptengelmann@gmail.com"];

async function isSuperuser(userId: string): Promise<boolean> {
  const rows = await sql`SELECT email FROM users WHERE id = ${userId}`;
  return rows.length > 0 && SUPERUSER_EMAILS.includes(rows[0].email as string);
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  if (await isSuperuser(userId)) return "business";

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

  const superuser = await isSuperuser(userId);

  return {
    allowed: superuser || used < limit,
    plan,
    used,
    limit: superuser ? Infinity : limit,
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
