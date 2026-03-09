import { sql } from "@/lib/db";

async function ensureActivityTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

let tableReady = false;

export async function trackEvent(
  event: string,
  userId?: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    if (!tableReady) {
      await ensureActivityTable();
      tableReady = true;
    }

    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    await sql`
      INSERT INTO activity_events (id, user_id, event, metadata)
      VALUES (${id}, ${userId || null}, ${event}, ${JSON.stringify(metadata || {})})
    `;
  } catch (error) {
    // Activity tracking should never break the main request
    console.error("Activity tracking error:", error);
  }
}

// ── Analytics queries ──

export async function getAnalytics() {
  const [
    totalUsers,
    totalReports,
    reportsThisMonth,
    reportsPerDay,
    topAreas,
    intentDistribution,
    recentActivity,
    userGrowth,
    activeUsersThisMonth,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::int as count FROM users`,
    sql`SELECT COUNT(*)::int as count FROM reports`,
    sql`SELECT COUNT(*)::int as count FROM reports WHERE created_at >= date_trunc('month', NOW())`,
    sql`
      SELECT date_trunc('day', created_at)::date as day, COUNT(*)::int as count
      FROM reports
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day
    `,
    sql`
      SELECT area, COUNT(*)::int as count
      FROM reports
      GROUP BY area ORDER BY count DESC LIMIT 10
    `,
    sql`
      SELECT intent, COUNT(*)::int as count
      FROM reports
      GROUP BY intent ORDER BY count DESC
    `,
    sql`
      SELECT ae.event, ae.user_id, ae.metadata, ae.created_at, u.name, u.email
      FROM activity_events ae
      LEFT JOIN users u ON ae.user_id = u.id
      ORDER BY ae.created_at DESC LIMIT 30
    `,
    sql`
      SELECT date_trunc('day', created_at)::date as day, COUNT(*)::int as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day
    `,
    sql`
      SELECT COUNT(DISTINCT user_id)::int as count
      FROM reports
      WHERE created_at >= date_trunc('month', NOW())
    `,
  ]);

  return {
    totalUsers: totalUsers[0].count as number,
    totalReports: totalReports[0].count as number,
    reportsThisMonth: reportsThisMonth[0].count as number,
    activeUsersThisMonth: activeUsersThisMonth[0].count as number,
    reportsPerDay: reportsPerDay as { day: string; count: number }[],
    topAreas: topAreas as { area: string; count: number }[],
    intentDistribution: intentDistribution as { intent: string; count: number }[],
    recentActivity: recentActivity as {
      event: string;
      user_id: string | null;
      metadata: Record<string, unknown>;
      created_at: string;
      name: string | null;
      email: string | null;
    }[],
    userGrowth: userGrowth as { day: string; count: number }[],
  };
}
