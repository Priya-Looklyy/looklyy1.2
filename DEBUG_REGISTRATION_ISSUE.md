# Debug: Registration Not Saving to Database

## Quick Debugging Steps

### Step 1: Check Vercel Logs (CRITICAL!)

1. Go to **Vercel Dashboard** → Your Project (`looklyy.04` or `looklyy1.2`)
2. Click **Deployments** tab
3. Click on the **latest deployment**
4. Click **Logs** tab
5. Look for:
   - Errors mentioning `DATABASE_URL`
   - Errors mentioning `prisma`
   - Errors mentioning `registration`
   - Any red error messages

**What to look for:**
- `Can't reach database server`
- `Environment variable not found: DATABASE_URL`
- `Prisma Client initialization error`
- `P1001: Can't reach database server`

### Step 2: Check Browser Console

1. Open https://looklyy.com in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Submit a test registration
5. Look for any **red error messages**
6. Go to **Network** tab
7. Find the request to `/api/register`
8. Click on it
9. Check:
   - **Status** (should be 200)
   - **Response** tab - what does it say?

### Step 3: Verify DATABASE_URL in Vercel

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Look for `DATABASE_URL`
3. Check:
   - ✅ Does it exist?
   - ✅ Is it enabled for **Production**?
   - ✅ Does the value start with `postgres://` or `postgresql://`?

### Step 4: Test API Directly

Open this URL in your browser (replace with your actual email):
```
https://looklyy.com/api/register
```

Or use this curl command:
```bash
curl -X POST https://looklyy.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Expected:** `{"success":true,"message":"Registration successful","id":"..."}`
**If error:** Copy the error message

### Step 5: Check Build Logs

In Vercel → Latest Deployment → **Build Logs**:
- Look for `prisma generate`
- Should see: `✔ Generated Prisma Client`
- If not, Prisma client isn't being generated

## Common Issues & Fixes

### Issue 1: DATABASE_URL Not Set in Production

**Fix:**
1. Vercel → Settings → Environment Variables
2. Add `DATABASE_URL` if missing
3. Value: Copy from Supabase Quickstart (`DATABASE__POSTGRES_PRISMA_URL`)
4. Enable for: **Production, Preview, Development**
5. Redeploy

### Issue 2: Prisma Client Not Generated

**Fix:**
Add to `package.json` scripts:
```json
"postinstall": "prisma generate"
```

Or add to `vercel.json`:
```json
{
  "buildCommand": "npm run db:generate && npm run build"
}
```

### Issue 3: RLS Blocking Inserts

**Fix:**
1. Supabase → Table Editor → `registrations`
2. Click **Definition** tab
3. Toggle **RLS** OFF (or create insert policy)

### Issue 4: Connection String Format

Make sure DATABASE_URL uses **pooler** connection:
```
postgres://postgres.czxyxvfbddjrxnykfghh:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

NOT direct connection:
```
postgres://postgres:password@db.czxyxvfbddjrxnykfghh.supabase.co:5432/postgres
```

## What to Report Back

Please check and tell me:
1. **What do Vercel logs show?** (any errors?)
2. **What does browser console show?** (any errors?)
3. **What does the API response say?** (when you test directly)
4. **Is DATABASE_URL set in Vercel?** (yes/no)

This will help me pinpoint the exact issue!
