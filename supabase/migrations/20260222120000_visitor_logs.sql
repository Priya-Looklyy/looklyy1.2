-- visitor_logs: structured visitor analytics for Looklyy
-- Run in Supabase SQL Editor or: supabase db push

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

COMMENT ON TABLE public.visitor_logs IS
  'Per-visit analytics rows. Use service role from server only; avoid exposing raw IP in client-facing APIs.';

COMMENT ON COLUMN public.visitor_logs.time_spent IS 'Seconds on page; update via beacon when visit ends.';
COMMENT ON COLUMN public.visitor_logs.is_unique IS 'True if this was the first-ever visit for visitor_id.';

-- Core lookups
CREATE INDEX visitor_logs_visitor_id_idx ON public.visitor_logs (visitor_id);

CREATE INDEX visitor_logs_visit_timestamp_idx ON public.visitor_logs (visit_timestamp DESC);

-- Reporting: date-range scans + aggregates (e.g. by day + country)
CREATE INDEX visitor_logs_visit_ts_country_idx
  ON public.visitor_logs (visit_timestamp DESC, location_country);

-- Reporting: filter form conversions in a time window
CREATE INDEX visitor_logs_visit_ts_form_idx
  ON public.visitor_logs (visit_timestamp DESC)
  WHERE form_filled = true;

-- Optional: latest row per visitor (dashboard “last seen”)
CREATE INDEX visitor_logs_visitor_visit_idx
  ON public.visitor_logs (visitor_id, visit_timestamp DESC);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- No GRANT to anon/authenticated for INSERT/SELECT — use service_role from Node/Next API only.
-- To allow read-only dashboard for authenticated users later, add a policy, e.g.:
-- CREATE POLICY "staff_select" ON public.visitor_logs FOR SELECT TO authenticated USING (true);
