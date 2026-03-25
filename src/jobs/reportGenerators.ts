import { buildMetricsTable } from '@/lib/email/wrapReportHtml';
import type { VisitorRangeStats } from '@/lib/analytics/visitorReportData';

function statsTable(stats: VisitorRangeStats): string {
  return buildMetricsTable('Overview', [
    { label: 'Period', value: stats.periodLabel },
    {
      label: 'Range (UTC)',
      value: `${stats.rangeStartIso.slice(0, 10)} → ${stats.rangeEndIso.slice(0, 10)}`,
    },
    { label: 'Total visits', value: stats.totalVisits },
    { label: 'Unique visitors', value: stats.uniqueVisitors },
    { label: 'Form submissions', value: stats.formSubmissions },
    { label: 'Data source', value: stats.dataSource },
  ]);
}

function unconfiguredNote(stats: VisitorRangeStats): string {
  if (stats.dataSource !== 'unconfigured') return '';
  return '<p style="margin-top:16px;color:#b45309;">Supabase is not configured for this worker; metrics are zero. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.</p>';
}

export function buildDailyReportHtml(stats: VisitorRangeStats): string {
  return statsTable(stats) + unconfiguredNote(stats);
}

export function buildWeeklyReportHtml(stats: VisitorRangeStats): string {
  return statsTable(stats) + unconfiguredNote(stats);
}

export function buildMonthlyReportHtml(stats: VisitorRangeStats): string {
  return statsTable(stats) + unconfiguredNote(stats);
}
