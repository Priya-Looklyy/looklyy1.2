# Looklyy client tracker (`/analytics/looklyy-track.js`)

## Behaviour

- **`visitorId`**: UUID in `localStorage` (`looklyy_visitor_id_v2`). Created on first visit.
- **`isUnique`**: `true` only on the first visit (no id in storage yet); `false` on return visits.
- **`timestamp`**: ISO time when the page session started.
- **`timeSpent`**: Active time in seconds (tab visible); updated on `visibilitychange`, finalised on `pagehide` / `beforeunload`.
- **`formFilled`**: `true` if any `<form>` fired `submit` (capture phase).
- **`sessionId`**: New UUID on each full page load; used to **dedupe** duplicate beacons (`pagehide` + `beforeunload`) in the database.
- **`location` / `ip`**: From `https://ipapi.co/json/` (idle-scheduled, non-blocking). If slow, first beacon may omit geo.
- **Endpoint**: `POST` same-origin **`/track`** (JSON body).

## Include manually (optional)

```html
<script src="/analytics/looklyy-track.js" defer data-track-url="/track"></script>
```

Custom base URL:

```html
<script src="https://looklyy.com/analytics/looklyy-track.js" defer data-track-url="https://looklyy.com/track"></script>
```

## Programmatic API

After load, `window.LooklyyTrack.init({ trackUrl: '/track' })` returns `{ flush, getPayload }` for tests or SPA extensions.

## Backend

`src/app/track/route.ts` validates the body and inserts into **`visitor_logs`** when `SUPABASE_SERVICE_ROLE_KEY` is set.

## CSP

`next.config.ts` includes `connect-src` for `ipapi.co`. Switching to **ipinfo.io** requires adding its host to `connect-src` and changing `GEO_ENDPOINT` in the script.
