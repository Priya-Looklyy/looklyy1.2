# Supabase Waitlist Insert Troubleshooting Guide

## Current Issue
The `/api/waitlist` endpoint returns 500 error when trying to insert data into Supabase.

## Step-by-Step Solution

### 1. Check Supabase Table Structure

Go to your Supabase Dashboard:
1. Open https://supabase.com/dashboard
2. Select your project (`amcegyadzphuvqtlseuf`)
3. Go to **Table Editor** → Find the `waitlist` table

**Verify the table has these columns:**
- `email` (type: `text` or `varchar`, should be NOT NULL)
- `phone_number` (type: `text` or `varchar`, can be NULL)
- `id` (auto-generated, primary key)
- `created_at` (auto-generated timestamp)

**If the table doesn't exist:**
```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Check Row Level Security (RLS) Policies

**This is the most common issue!**

1. In Supabase Dashboard → Go to **Authentication** → **Policies**
2. Find the `waitlist` table
3. Check if RLS is enabled

**If RLS is enabled, you need to add a policy:**

Click "New Policy" → "Create a policy from scratch":
- **Policy Name:** `Allow public inserts`
- **Allowed Operation:** `INSERT`
- **Target Roles:** `anon`, `authenticated`
- **USING expression:** `true`
- **WITH CHECK expression:** `true`

**Or disable RLS temporarily for testing:**
1. Go to **Table Editor** → `waitlist` table
2. Click the lock icon (RLS)
3. Toggle it OFF
4. Try the form again

### 3. Verify Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify these are set for **Production**:
   - `SUPABASE_URL` = `https://amcegyadzphuvqtlseuf.supabase.co`
   - `SUPABASE_ANON_KEY` = Your anon key (starts with `eyJhbGci...`)

3. **Important:** After adding/changing env vars, you MUST redeploy!

### 4. Test the Insert Directly

Visit: `https://www.looklyy.com/api/waitlist/test`

This will show if environment variables are set correctly.

### 5. Check Vercel Logs

1. Go to Vercel Dashboard → Your Deployment
2. Click **Logs** tab
3. Look for lines starting with `❌ Supabase insert error:`
4. The error message will tell you exactly what's wrong:
   - `relation "waitlist" does not exist` → Table doesn't exist
   - `permission denied` → RLS policy blocking insert
   - `column "email" does not exist` → Column name mismatch

### 6. Quick Fix: Disable RLS (For Testing)

If you want to test quickly:

1. Supabase Dashboard → **Table Editor** → `waitlist`
2. Click the **lock icon** (RLS) to disable it
3. Try the form again
4. If it works, then RLS is the issue - add the policy from step 2

### 7. Common Error Messages and Solutions

| Error Message | Solution |
|--------------|----------|
| `relation "waitlist" does not exist` | Create the table (see step 1) |
| `permission denied for table waitlist` | Add RLS policy or disable RLS |
| `column "email" does not exist` | Check column names match exactly |
| `duplicate key value violates unique constraint` | Email already exists (this is OK - handled) |
| `TypeError: fetch failed` | Network issue or Supabase URL incorrect |

## After Making Changes

1. **Redeploy on Vercel** (if you changed env vars or code)
2. **Try the form again**
3. **Check the error message** - it should now be more specific

## Still Not Working?

Check the Vercel logs and look for the detailed error message. The improved error handling will now show:
- Exact Supabase error message
- Error code
- Whether it's a table, permission, or schema issue
