# Looklyy Track API (Express)

Standalone **`POST /track`** service: validates payloads, inserts into Supabase `visitor_logs`, dedupes by **`session_id`**.

## Setup

```bash
cd server
cp .env.example .env
# Edit .env with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

## Endpoints

| Method | Path     | Description        |
|--------|----------|--------------------|
| `POST` | `/track` | Visitor log ingest |
| `GET`  | `/health`| Liveness           |

## Payload

Same as the browser tracker; **`sessionId`** (UUID, one per page load) is **required** so duplicate beacons return `{ success: true, duplicate: true }` without a second row.

## Database

Apply migrations in repo root `supabase/migrations/` including **`20260223100000_visitor_logs_session_id.sql`**.

## Production

- Run behind HTTPS reverse proxy (pass `X-Forwarded-For` if you override IP).
- Set `CORS_ORIGIN` to your site origin(s).
- Use `npm start` with `NODE_ENV=production`.
