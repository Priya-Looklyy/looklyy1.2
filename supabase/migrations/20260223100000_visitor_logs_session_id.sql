-- One row per browser session (tab load). Prevents duplicate beacons for the same session.
ALTER TABLE public.visitor_logs
  ADD COLUMN IF NOT EXISTS session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS visitor_logs_session_id_key
  ON public.visitor_logs (session_id)
  WHERE session_id IS NOT NULL;

COMMENT ON COLUMN public.visitor_logs.session_id IS
  'Client-generated UUID per page load; duplicate POSTs with same session_id are ignored.';
