# Debug Registration Not Saving

## Issue
Registration form submits successfully on looklyy.com, but data doesn't appear in the database table.

## Possible Causes & Solutions

### 1. Check Vercel Logs (Most Important!)

**Steps:**
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **Logs** tab
4. Look for errors related to:
   - `DATABASE_URL`
   - `prisma`
   - `registration`
   - Any error messages

**What to look for:**
- `Can't reach database server`
- `Environment variable not found: DATABASE_URL`
- `Prisma Client initialization error`
- `Unique constraint violation` (if email already exists)

### 2. Verify DATABASE_URL in Vercel

**Steps:**
1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Confirm `DATABASE_URL` exists
3. Check it's enabled for **Production** environment
4. The value should start with `postgres://` or `postgresql://`

### 3. Check RLS (Row Level Security)

The warning shows "RLS Disabled" - this shouldn't block inserts, but let's verify:

**In Supabase:**
1. Go to **Authentication** → **Policies**
2. Or go to **Table Editor** → `registrations` → **Definition** tab
3. Check if RLS is enabled (it shouldn't be for this use case)

**If RLS is blocking:**
- Go to **Table Editor** → `registrations`
- Click **Definition** tab
- Toggle **RLS** off (or create a policy allowing inserts)

### 4. Test API Endpoint Directly

**Using curl or browser:**
```bash
curl -X POST https://looklyy.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "id": "..."
}
```

**If error:**
- Check the error message
- It will tell us what's wrong

### 5. Check Browser Console

**Steps:**
1. Open looklyy.com in browser
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Submit a registration
5. Look for any JavaScript errors
6. Go to **Network** tab
7. Find the `/api/register` request
8. Check the **Response** - what does it say?

### 6. Verify Prisma Client is Generated

**In Vercel build logs:**
- Check if `prisma generate` runs during build
- If not, we need to add it to build command

## Quick Fixes to Try

### Fix 1: Add Error Logging

The API route should log errors. Check Vercel logs to see what's happening.

### Fix 2: Verify Connection String Format

Make sure DATABASE_URL in Vercel uses the **pooler** connection:
```
postgres://postgres.czxyxvfbddjrxnykfghh:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

NOT the direct connection:
```
postgres://postgres:password@db.czxyxvfbddjrxnykfghh.supabase.co:5432/postgres
```

### Fix 3: Check Build Output

In Vercel → Deployments → Latest → Build Logs:
- Look for `prisma generate` output
- Check for any Prisma errors

## Next Steps

1. **Check Vercel Logs first** - this will tell us exactly what's wrong
2. **Test API directly** - see if endpoint is reachable
3. **Check browser console** - see what error the frontend gets
4. **Verify DATABASE_URL** - make sure it's set correctly

Let me know what you find in the Vercel logs!
