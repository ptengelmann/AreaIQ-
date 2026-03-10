import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPlan } from "@/lib/usage";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(userId);
  if (plan !== "business") {
    return NextResponse.json(
      { error: "API usage dashboard requires the Business plan" },
      { status: 403 }
    );
  }

  try {
    // Query activity_events for api.report.generated events for this user
    const [
      totalRequests,
      requestsThisMonth,
      requestsByDay,
      lastRequest,
      apiKeys,
    ] = await Promise.all([
      // Total API requests (all time)
      sql`
        SELECT COUNT(*)::int as count
        FROM activity_events
        WHERE user_id = ${userId} AND event = 'api.report.generated'
      `,
      // Requests this month
      sql`
        SELECT COUNT(*)::int as count
        FROM activity_events
        WHERE user_id = ${userId}
          AND event = 'api.report.generated'
          AND created_at >= date_trunc('month', NOW())
      `,
      // Requests per day (last 30 days)
      sql`
        SELECT date_trunc('day', created_at)::date as day, COUNT(*)::int as count
        FROM activity_events
        WHERE user_id = ${userId}
          AND event = 'api.report.generated'
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
      `,
      // Last request timestamp
      sql`
        SELECT created_at
        FROM activity_events
        WHERE user_id = ${userId} AND event = 'api.report.generated'
        ORDER BY created_at DESC
        LIMIT 1
      `,
      // Active API keys with usage count from activity_events metadata
      sql`
        SELECT
          ak.id,
          LEFT(ak.key, 8) || '...' as key_preview,
          ak.name,
          ak.created_at,
          ak.last_used_at
        FROM api_keys ak
        WHERE ak.user_id = ${userId} AND ak.revoked = FALSE
        ORDER BY ak.created_at DESC
      `,
    ]);

    // Fill in missing days with zero counts for the chart
    const dayMap = new Map<string, number>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dayMap.set(key, 0);
    }
    for (const row of requestsByDay) {
      const key = new Date(row.day as string).toISOString().split("T")[0];
      dayMap.set(key, row.count as number);
    }

    const dailyData = Array.from(dayMap.entries()).map(([day, count]) => ({
      day,
      count,
    }));

    return NextResponse.json({
      totalRequests: (totalRequests[0]?.count as number) || 0,
      requestsThisMonth: (requestsThisMonth[0]?.count as number) || 0,
      monthlyLimit: 300,
      dailyData,
      lastRequestAt: (lastRequest[0]?.created_at as string) || null,
      keys: apiKeys.map((k) => ({
        id: k.id as string,
        key_preview: k.key_preview as string,
        name: k.name as string,
        created_at: k.created_at as string,
        last_used_at: k.last_used_at as string | null,
      })),
    });
  } catch (error) {
    console.error("[API Usage] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
