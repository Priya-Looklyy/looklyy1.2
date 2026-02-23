# Supabase ↔ Vercel Verification Report — Looklyy.com

**Date:** 2026-02-23  
**Site:** https://looklyy.com  
**Purpose:** Establish verified connection between Supabase and Vercel.

---

## Summary

| Check | Status | Notes |
|-------|--------|--------|
| Vercel environment variables | ✅ Pass | `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in production |
| Supabase URL format | ✅ Pass | Valid `https://*.supabase.co` URL |
| Supabase client creation | ✅ Pass | Client instantiates successfully on Vercel |
| REST API / Table query | ❌ Fail | `TypeError: fetch failed` — outbound requests from Vercel to Supabase are failing |

**Overall:** **Not verified.** Configuration on Vercel is correct, but the serverless runtime cannot reach Supabase (network/connectivity failure).

---

## Diagnostic Results (Production)

- **Endpoint used:** `GET https://looklyy.com/api/waitlist/diagnose`
- **Supabase project (production):** `amcegyadzphuvqtlseuf.supabase.co`
- **Environment:** `NODE_ENV=production`

### What works

1. **Env vars:** Both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are present and non-empty in the Vercel production environment.
2. **URL:** Valid HTTPS URL; hostname `amcegyadzphuvqtlseuf.supabase.co`.
3. **Client:** `createClient(supabaseUrl, supabaseAnonKey)` runs without throwing.

### What fails

- **REST API test:** `fetch(...)` to Supabase REST base fails with `TypeError: fetch failed`.
- **Table query:** `supabase.from('waitlist').select('id').limit(1)` fails with the same `TypeError: fetch failed`.

So the failure is at the **network** layer between Vercel’s serverless functions and Supabase’s API, not at config or auth.

---

## Likely Causes

1. **Supabase project paused**  
   Free-tier projects pause after inactivity. In [Supabase Dashboard](https://supabase.com/dashboard) → project `amcegyadzphuvqtlseuf` → **Settings** → **General**, check status and resume if paused.

2. **Transient network / DNS**  
   Less common; retry the diagnostic after a few minutes.

3. **Supabase or Vercel incident**  
   Check [Supabase Status](https://status.supabase.com) and [Vercel Status](https://www.vercel-status.com).

---

## How to Re-run Verification

1. **Full diagnostic (detailed):**
   ```bash
   curl -s https://looklyy.com/api/waitlist/diagnose | jq
   ```

2. **Simple connection test:**
   ```bash
   curl -s https://looklyy.com/api/waitlist/test-connection | jq
   ```

3. **Single verified/unverified result (after deploying the new route):**
   ```bash
   curl -s https://looklyy.com/api/verify-supabase-vercel | jq
   ```

When the connection is working, you should see:
- `diagnose`: `tableQuery.success === true`
- `test-connection`: `success === true` and `connection.queryTest.success === true`
- `verify-supabase-vercel`: `verified === true`

---

## Recommended Next Steps

1. In Supabase Dashboard, confirm project `amcegyadzphuvqtlseuf` is **active** (not paused). Resume if needed.
2. After resuming (or if it was already active), wait 1–2 minutes and re-run the diagnostic URLs above.
3. If it still fails, check Supabase project **Settings → API** for any IP or access restrictions, and Vercel **Settings → Environment Variables** to ensure Production has the correct `SUPABASE_URL` and `SUPABASE_ANON_KEY` for this project.
4. Deploy the new ` /api/verify-supabase-vercel` route so you have a single endpoint that returns `verified: true/false` for monitoring or status pages.

---

## Endpoints Reference

| Endpoint | Purpose |
|----------|--------|
| `/api/waitlist/diagnose` | Full diagnostic (env, URL, client, REST, table query) |
| `/api/waitlist/test-connection` | Quick connection test (env + client + one query) |
| `/api/verify-supabase-vercel` | Single verification result (`verified` + reason) — deploy to use on production |
