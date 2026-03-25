/**
 * Scheduled analytics reports (node-cron).
 *
 * Run in production as a long-lived process (Docker, PM2, Railway, Fly, VPS).
 * Not compatible with serverless-only hosts (e.g. Vercel) — use Vercel Cron → API route there.
 *
 * Usage:
 *   npm run cron:reports
 *   npm run cron:once:daily    # one-off test (no daemon)
 *
 * Env:
 *   CRON_TZ — IANA timezone (default UTC), e.g. America/New_York, Asia/Kolkata (9am IST)
 *   Plus email + Supabase vars (see docs/cron-reports.md)
 */

import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import cron from 'node-cron';

loadEnv({ path: resolve(process.cwd(), '.env.local') });
loadEnv({ path: resolve(process.cwd(), '.env') });

import { sendReportEmail } from '@/lib/email/sendReportEmail';
import {
  getDailyReportStats,
  getMonthlyReportStats,
  getWeeklyReportStats,
} from '@/lib/analytics/visitorReportData';
import {
  buildDailyReportHtml,
  buildMonthlyReportHtml,
  buildWeeklyReportHtml,
} from './reportGenerators';

const TZ = process.env.CRON_TZ || 'UTC';

const locks = {
  daily: false,
  weekly: false,
  monthly: false,
};

function log(level: 'info' | 'warn' | 'error', job: string, message: string, meta?: Record<string, unknown>) {
  const line = {
    ts: new Date().toISOString(),
    level,
    job,
    message,
    ...meta,
  };
  const text = `[report-cron] ${JSON.stringify(line)}`;
  if (level === 'error') console.error(text);
  else if (level === 'warn') console.warn(text);
  else console.log(text);
}

async function withLock(
  name: keyof typeof locks,
  fn: () => Promise<void>,
): Promise<void> {
  if (locks[name]) {
    log('warn', name, 'skipped_overlapping_run');
    return;
  }
  locks[name] = true;
  try {
    await fn();
  } finally {
    locks[name] = false;
  }
}

async function runDaily(): Promise<void> {
  await withLock('daily', async () => {
    log('info', 'daily', 'start');
    try {
      const stats = await getDailyReportStats();
      const html = buildDailyReportHtml(stats);
      const result = await sendReportEmail('Daily analytics report', html);
      if (!result.ok) {
        log('error', 'daily', 'send_failed', { error: result.error });
        return;
      }
      log('info', 'daily', 'complete', { provider: result.provider, messageId: result.messageId });
    } catch (e) {
      log('error', 'daily', 'exception', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });
}

async function runWeekly(): Promise<void> {
  await withLock('weekly', async () => {
    log('info', 'weekly', 'start');
    try {
      const stats = await getWeeklyReportStats();
      const html = buildWeeklyReportHtml(stats);
      const result = await sendReportEmail('Weekly analytics report', html);
      if (!result.ok) {
        log('error', 'weekly', 'send_failed', { error: result.error });
        return;
      }
      log('info', 'weekly', 'complete', { provider: result.provider, messageId: result.messageId });
    } catch (e) {
      log('error', 'weekly', 'exception', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });
}

async function runMonthly(): Promise<void> {
  await withLock('monthly', async () => {
    log('info', 'monthly', 'start');
    try {
      const stats = await getMonthlyReportStats();
      const html = buildMonthlyReportHtml(stats);
      const result = await sendReportEmail('Monthly analytics report', html);
      if (!result.ok) {
        log('error', 'monthly', 'send_failed', { error: result.error });
        return;
      }
      log('info', 'monthly', 'complete', { provider: result.provider, messageId: result.messageId });
    } catch (e) {
      log('error', 'monthly', 'exception', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });
}

const cronOptions = { timezone: TZ };

let dailyTask: ReturnType<typeof cron.schedule> | null = null;
let weeklyTask: ReturnType<typeof cron.schedule> | null = null;
let monthlyTask: ReturnType<typeof cron.schedule> | null = null;

function shutdown(signal: string) {
  log('info', 'bootstrap', 'shutdown', { signal });
  dailyTask?.stop();
  weeklyTask?.stop();
  monthlyTask?.stop();
  process.exit(0);
}

function startSchedulers(): void {
  /** Every day at 9:00 (in CRON_TZ) */
  dailyTask = cron.schedule('0 9 * * *', () => void runDaily(), cronOptions);

  /** Every Monday at 9:00 */
  weeklyTask = cron.schedule('0 9 * * 1', () => void runWeekly(), cronOptions);

  /** 1st of month at 9:00 */
  monthlyTask = cron.schedule('0 9 1 * *', () => void runMonthly(), cronOptions);

  log('info', 'bootstrap', 'schedules_registered', {
    tz: TZ,
    daily: '0 9 * * *',
    weekly: '0 9 * * 1 (Monday)',
    monthly: '0 9 1 * *',
  });
}

async function main(): Promise<void> {
  if (process.argv[2] === 'once') {
    const which = (process.argv[3] || 'daily').toLowerCase() as 'daily' | 'weekly' | 'monthly';
    const runners = {
      daily: runDaily,
      weekly: runWeekly,
      monthly: runMonthly,
    } as const;
    const fn = runners[which];
    if (!fn) {
      console.error(`[report-cron] Unknown job "${which}". Use: daily | weekly | monthly`);
      process.exit(1);
    }
    log('info', 'once', 'manual_run', { which });
    await fn();
    process.exit(0);
    return;
  }

  startSchedulers();

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    log('error', 'process', 'unhandledRejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
    });
  });
}

void main();
