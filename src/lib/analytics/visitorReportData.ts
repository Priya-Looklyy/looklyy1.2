import { getSupabaseServiceClient } from '@/lib/supabase-service-client';

export type VisitorRangeStats = {
  periodLabel: string;
  rangeStartIso: string;
  rangeEndIso: string;
  totalVisits: number;
  uniqueVisitors: number;
  formSubmissions: number;
  dataSource: 'supabase' | 'unconfigured';
};

function startOfUtcDay(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function endOfUtcDay(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(23, 59, 59, 999);
  return x;
}

async function aggregateRange(
  start: Date,
  end: Date,
  periodLabel: string,
): Promise<VisitorRangeStats> {
  const supabase = getSupabaseServiceClient();
  const rangeStartIso = start.toISOString();
  const rangeEndIso = end.toISOString();

  if (!supabase) {
    return {
      periodLabel,
      rangeStartIso,
      rangeEndIso,
      totalVisits: 0,
      uniqueVisitors: 0,
      formSubmissions: 0,
      dataSource: 'unconfigured',
    };
  }

  const { data, error } = await supabase
    .from('visitor_logs')
    .select('visitor_id, form_filled')
    .gte('visit_timestamp', rangeStartIso)
    .lte('visit_timestamp', rangeEndIso);

  if (error) {
    console.error('[visitorReportData]', error.message);
    return {
      periodLabel,
      rangeStartIso,
      rangeEndIso,
      totalVisits: 0,
      uniqueVisitors: 0,
      formSubmissions: 0,
      dataSource: 'supabase',
    };
  }

  const rows = data ?? [];
  const uniqueVisitors = new Set(rows.map((r) => r.visitor_id)).size;
  const formSubmissions = rows.filter((r) => r.form_filled).length;

  return {
    periodLabel,
    rangeStartIso,
    rangeEndIso,
    totalVisits: rows.length,
    uniqueVisitors,
    formSubmissions,
    dataSource: 'supabase',
  };
}

/** Previous UTC calendar day (full day). */
export async function getDailyReportStats(now = new Date()): Promise<VisitorRangeStats> {
  const y = new Date(now);
  y.setUTCDate(y.getUTCDate() - 1);
  const start = startOfUtcDay(y);
  const end = endOfUtcDay(y);
  return aggregateRange(start, end, `Daily (${start.toISOString().slice(0, 10)} UTC)`);
}

/** Previous UTC Monday–Sunday week (the week that ended before this Monday). */
export async function getWeeklyReportStats(now = new Date()): Promise<VisitorRangeStats> {
  const d = new Date(now);
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const daysSinceMonday = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday - 7);
  const weekStart = startOfUtcDay(d);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return aggregateRange(
    weekStart,
    weekEnd,
    `Weekly (${weekStart.toISOString().slice(0, 10)} – ${weekEnd.toISOString().slice(0, 10)} UTC)`,
  );
}

/** Previous UTC calendar month. */
export async function getMonthlyReportStats(now = new Date()): Promise<VisitorRangeStats> {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const start = startOfUtcDay(d);
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return aggregateRange(
    start,
    end,
    `Monthly (${start.toISOString().slice(0, 7)} UTC)`,
  );
}
