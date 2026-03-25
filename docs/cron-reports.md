# Scheduled report emails (`node-cron`)

## Schedules (9:00 in `CRON_TZ`, default **UTC**)

**9:00 India (IST):** set `CRON_TZ=Asia/Kolkata` in `.env.local` — daily/weekly/monthly jobs then run at **9:00 IST**.

| Job | Cron | When |
|-----|------|------|
| Daily | `0 9 * * *` | Every day at 9:00 |
| Weekly | `0 9 * * 1` | Every **Monday** at 9:00 |
| Monthly | `0 9 1 * *` | **1st** of each month at 9:00 |

## What each job does

1. Loads metrics from `visitor_logs` (previous UTC day / week / month).
2. Builds HTML tables via `buildMetricsTable`.
3. Sends email with `sendReportEmail` → **hello@looklyy.com** (or `REPORT_EMAIL_TO`).

## Run locally / production worker

**Long-lived process** (required for `node-cron`):

```bash
npm run cron:reports
```

Use **PM2**, **Docker**, **systemd**, **Railway**, **Fly.io**, etc. — **not** plain Vercel serverless (no persistent process).

### One-off test (no scheduler)

```bash
npm run cron:once:daily
npm run cron:once:weekly
npm run cron:once:monthly
```

## Environment

| Variable | Description |
|----------|-------------|
| `CRON_TZ` | IANA timezone (default `UTC`). Examples: `America/New_York`, **`Asia/Kolkata`** (IST) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | For real metrics |
| `REPORT_EMAIL_FROM`, `RESEND_API_KEY` or SMTP | See [email-reports.md](./email-reports.md) |

## Logs

Structured JSON lines to stdout, e.g.:

```json
{"ts":"...","level":"info","job":"daily","message":"start"}
{"ts":"...","level":"info","job":"daily","message":"complete","provider":"resend","messageId":"..."}
```

Errors use `"level":"error"` with `send_failed` or `exception`.

## Overlap protection

If a job is still running when the next tick fires, the second run is **skipped** (`skipped_overlapping_run`).

## Vercel alternative

On Vercel, use **Vercel Cron** to `GET`/`POST` a secured API route that calls the same report functions (extract shared logic from `src/jobs/` into `src/lib/` if needed).
