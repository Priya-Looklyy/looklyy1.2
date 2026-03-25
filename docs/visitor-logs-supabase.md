# `visitor_logs` — SQL + Node.js setup

The canonical migration file is:

`supabase/migrations/20260222120000_visitor_logs.sql`

## SQL (copy-paste into Supabase SQL Editor)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.visitor_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id text NOT NULL,
  is_unique boolean NOT NULL DEFAULT false,
  visit_timestamp timestamptz NOT NULL DEFAULT now(),
  time_spent integer NOT NULL DEFAULT 0 CHECK (time_spent >= 0 AND time_spent < 864000),
  form_filled boolean NOT NULL DEFAULT false,
  location_country text,
  location_city text,
  ip_address text,
  page_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX visitor_logs_visitor_id_idx ON public.visitor_logs (visitor_id);
CREATE INDEX visitor_logs_visit_timestamp_idx ON public.visitor_logs (visit_timestamp DESC);
CREATE INDEX visitor_logs_visit_ts_country_idx ON public.visitor_logs (visit_timestamp DESC, location_country);
CREATE INDEX visitor_logs_visit_ts_form_idx ON public.visitor_logs (visit_timestamp DESC) WHERE form_filled = true;
CREATE INDEX visitor_logs_visitor_visit_idx ON public.visitor_logs (visitor_id, visit_timestamp DESC);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
```

## Plain Node.js (Express, cron, scripts)

Install: `npm install @supabase/supabase-js dotenv`

```js
// visitor-log-insert.mjs
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from('visitor_logs')
  .insert({
    visitor_id: 'client-stable-id-abc',
    is_unique: true,
    visit_timestamp: new Date().toISOString(),
    time_spent: 0,
    form_filled: false,
    location_country: 'US',
    location_city: 'New York',
    ip_address: 'redact-or-hash-in-production',
    page_url: 'https://looklyy.com/',
  })
  .select('id')
  .single();

if (error) console.error(error);
else console.log('Inserted', data);
```

## Next.js / this repo

Use `src/lib/supabase-service-client.ts`:

- `getSupabaseServiceClient()`
- `insertVisitorLog(row)`
- `updateVisitorLogDuration(id, { time_spent, form_filled? })`

Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables.
