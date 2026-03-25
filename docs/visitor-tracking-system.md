# Looklyy — Full-stack visitor tracking & reporting

Production-oriented design: collect structured analytics, store in Supabase, aggregate via cron, deliver reports by email.

---

## 1. Goals & metrics

| Metric | How |
|--------|-----|
| **Visitor type** | First row for `visitor_key` → unique; subsequent → repeat (or derive from `first_seen_at`). |
| **Visit timestamp** | `visited_at` (session start) + optional `heartbeat_at` / `session_ended_at`. |
| **Time on page (seconds)** | Client sends `duration_seconds` on `visibilitychange` / `pagehide` / `beforeunload` (beacon); server validates cap (e.g. max 30 min). |
| **Form filled** | Client event when waitlist submit succeeds → `form_filled = true` on session or separate `events` row. |
| **Geo (country, city, IP)** | From `x-vercel-ip-country`, `x-vercel-ip-city`, `x-forwarded-for` (or MaxMind on self-hosted). Store **hashed IP** optional for privacy. |

---

## 2. High-level architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  looklyy.com (Next.js or static)                                         │
│  ┌──────────────────┐    ┌──────────────────┐                            │
│  │ vanilla tracker  │───▶│ POST /api/track  │  (or Express / Lambda)     │
│  │ (snippet.js)     │    │ POST /api/beacon │                            │
│  └──────────────────┘    └────────┬─────────┘                            │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Application layer (Node serverless or Express)                          │
│  • Validate payload, rate-limit, enrich geo from headers                 │
│  • Insert rows via Supabase service role (never expose to browser)       │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Supabase (PostgreSQL)                                                   │
│  • sessions / visits / events tables                                     │
│  • RLS: no public read; service role only for writes from API            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Reporting worker (cron)                                                 │
│  • Node script or Vercel Cron / GitHub Actions / Supabase pg_cron        │
│  • SQL aggregates → daily rollup table                                   │
│  • Resend / Nodemailer → weekly digest email                             │
└─────────────────────────────────────────────────────────────────────────┘
```

**Integration note:** Looklyy already uses **Next.js**. You can implement APIs as **Route Handlers** under `app/api/track/*` instead of a separate Express app, keeping one deployable. The folder structure below supports both “monolith (Next)” and “split service.”

---

## 3. Data flow

### 3.1 Session start (page load)

1. Tracker loads → reads `visitor_id` from `localStorage` (UUID v4) or creates one.
2. `POST /api/track/session` with `{ visitor_id, path, referrer, ua_hash }`.
3. Server creates `session_id` (UUID), sets `visited_at = now()`, resolves **unique vs repeat**:
   - `SELECT 1 FROM visitors WHERE visitor_id = $1` → if missing, insert visitor + mark `is_new_visitor = true`; else `is_new_visitor = false`.
4. Returns `{ session_id }` to client; client stores `session_id` in `sessionStorage`.

### 3.2 Heartbeat / duration (optional)

- Every N seconds (e.g. 15s), `POST /api/track/ping` with `{ session_id }` → updates `last_active_at`.
- Reduces reliance on unreliable `beforeunload` alone.

### 3.3 End of visit (time on page)

1. On `visibilitychange` (hidden), `pagehide`, or `beforeunload`, send:
   - `POST /api/track/beacon` with `navigator.sendBeacon` / `fetch keepalive`:
   - `{ session_id, duration_seconds, path }`.
2. Server updates `sessions.duration_seconds` (take `GREATEST` or sum pings for accuracy).

### 3.4 Form filled

1. On successful waitlist submit: `POST /api/track/event` with `{ session_id, type: 'form_submit', metadata: { form: 'waitlist' } }`.
2. Or patch session: `PATCH /api/track/session/:id` `{ form_filled: true }`.

### 3.5 Reporting cron

1. Daily 00:05 UTC: job runs SQL inserting into `analytics_daily_rollups`.
2. Weekly Mon 08:00: job queries last 7 days, builds HTML/text summary, sends via **Resend** (recommended) or Nodemailer.

---

## 4. Database schema (Supabase)

```sql
-- Stable identity per browser (not PII by itself)
CREATE TABLE visitors (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_key   uuid NOT NULL UNIQUE,  -- from client localStorage
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_visitors_key ON visitors (visitor_key);

-- One row per "session" (tab visit)
CREATE TABLE sessions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id         uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  visitor_key        uuid NOT NULL,   -- denormalized for queries
  started_at         timestamptz NOT NULL DEFAULT now(),
  ended_at           timestamptz,
  duration_seconds   integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0 AND duration_seconds < 86400),
  path               text,
  referrer           text,
  country            text,
  city               text,
  ip_hash            text,            -- optional SHA-256 of IP + salt
  user_agent_hash    text,
  is_new_visitor     boolean NOT NULL DEFAULT false,
  form_filled        boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_started ON sessions (started_at DESC);
CREATE INDEX idx_sessions_visitor ON sessions (visitor_id);
CREATE INDEX idx_sessions_country ON sessions (country);

-- Optional: granular events (clicks, video play, etc.)
CREATE TABLE session_events (
  id          bigserial PRIMARY KEY,
  session_id  uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  event_type  text NOT NULL,
  payload     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_session ON session_events (session_id);

-- Pre-aggregated for fast reporting
CREATE TABLE analytics_daily_rollups (
  day_utc         date PRIMARY KEY,
  unique_visitors integer NOT NULL,
  new_visitors    integer NOT NULL,
  repeat_visitors integer NOT NULL,
  total_sessions  integer NOT NULL,
  form_submits    integer NOT NULL,
  avg_duration_sec numeric(10,2)
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_rollups ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only service role inserts/reads from backend.
```

---

## 5. Folder structure

### Option A — Monolith (recommended for Looklyy / Next.js)

```
looklyy-demo/
├── public/
│   └── analytics/
│       └── looklyy-tracker.js    # Vanilla IIFE, loaded via <script src="...">
├── src/
│   ├── app/
│   │   └── api/
│   │       └── track/
│   │           ├── session/route.ts   # POST start
│   │           ├── ping/route.ts      # POST heartbeat
│   │           ├── beacon/route.ts    # POST duration (sendBeacon)
│   │           └── event/route.ts     # POST form / custom events
│   └── lib/
│       ├── analytics/
│       │   ├── enrich.ts              # geo from headers, hashing
│       │   ├── rate-limit.ts          # Upstash / in-memory dev
│       │   └── supabase-admin.ts      # service role client
│       └── supabase-env.ts
├── jobs/                              # or scripts/
│   ├── rollup-daily.ts                # node jobs/rollup-daily.ts
│   └── email-weekly-report.ts
├── docs/
│   └── visitor-tracking-system.md
└── supabase/migrations/
    └── YYYYMMDD_analytics.sql
```

### Option B — Standalone analytics microservice

```
looklyy-analytics/
├── package.json
├── src/
│   ├── server.ts              # Express app
│   ├── routes/
│   │   ├── session.ts
│   │   ├── beacon.ts
│   │   └── event.ts
│   ├── db/
│   │   └── supabase.ts
│   ├── jobs/
│   │   ├── rollup-daily.ts
│   │   └── email-report.ts
│   └── lib/
│       └── enrich.ts
├── public/
│   └── looklyy-tracker.js
└── Dockerfile                   # optional
```

---

## 6. APIs to build

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/track/session` | Start session; body: `visitor_key`, `path`, `referrer?`; returns `session_id`, `is_new_visitor`. |
| `POST` | `/api/track/ping` | Heartbeat; body: `session_id`; updates `last_active_at` (add column if using pings). |
| `POST` | `/api/track/beacon` | End/update duration; body: `session_id`, `duration_seconds`; use with `sendBeacon`. |
| `POST` | `/api/track/event` | Custom events; body: `session_id`, `type`, `payload?` (e.g. `form_submit`). |
| `PATCH` | `/api/track/session` | Optional: `{ session_id, form_filled: true }` instead of separate event. |
| `GET` | `/api/internal/report/daily` | **Protected** (secret header / Vercel cron auth): returns yesterday’s rollup JSON. |
| `POST` | `/api/internal/jobs/rollup` | Trigger daily rollup (called by cron only). |
| `POST` | `/api/internal/jobs/email-report` | Trigger weekly email (cron only). |

**Do not** expose raw `GET` listing all sessions without auth.

---

## 7. Vanilla tracker sketch (`looklyy-tracker.js`)

- Namespace: `window.LooklyyAnalytics`
- On load: ensure `visitor_key`, `POST /api/track/session`, store `session_id`
- `setInterval` ping every 15s (optional)
- `document.addEventListener('visibilitychange', …)` + `pagehide` → beacon duration
- Expose `LooklyyAnalytics.trackFormSuccess()` for waitlist success

Use `sendBeacon` with `Blob` + `Content-Type: application/json` where supported; fallback to `fetch(..., { keepalive: true })`.

---

## 8. Cron & email

| Job | Schedule | Action |
|-----|----------|--------|
| Daily rollup | `0 5 * * *` UTC | Run `rollup-daily.ts`: aggregate `sessions` → `analytics_daily_rollups`. |
| Weekly email | `0 8 * * 1` UTC | Query rollups + top countries; send HTML email via **Resend** API. |

**Vercel:** `vercel.json` `crons` hitting secured routes.  
**Alternative:** GitHub Actions `schedule`, or Supabase **Edge Functions** + **pg_cron** for SQL-only rollups.

---

## 9. Production checklist

- [ ] **Service role key** only on server; never in client bundle.
- [ ] **Rate limiting** per IP + per `visitor_key` on `/api/track/*`.
- [ ] **CORS** if tracker is on CDN subdomain (same-origin avoids CORS).
- [ ] **GDPR / privacy policy** — disclose analytics, retention, opt-out link if required.
- [ ] **IP hashing** — salt in env; store hash only if you need fraud detection without raw IP.
- [ ] **Cap `duration_seconds`** — ignore absurd values (bots).
- [ ] **Idempotent beacons** — optional `beacon_id` UUID to dedupe double fire.

---

*Document version: 1.1 — implementation-ready blueprint.*
