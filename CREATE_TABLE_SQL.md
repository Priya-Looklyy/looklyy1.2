# Create Registrations Table - SQL Script

## Quick Setup via Supabase SQL Editor

Since `npm run db:push` is timing out locally, you can create the table directly in Supabase:

### Steps:

1. **Open Supabase Dashboard:**
   - Go to Vercel → Storage → Pre-Registrations
   - Click "Open in Supabase"

2. **Go to SQL Editor:**
   - In Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run this SQL:**

```sql
-- Create registrations table (matches Prisma schema)
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on createdAt for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations("createdAt");
```

4. **Click "Run"** (or press Ctrl+Enter)

5. **Verify:**
   - Go to "Table Editor" in Supabase
   - You should see the `registrations` table
   - It should have columns: id, email, name, createdAt, updatedAt

## Alternative: Test in Production

If you prefer, you can also:
1. Deploy your code to Vercel (push to GitHub)
2. Test registration on looklyy.com
3. If the table doesn't exist, Prisma will show an error, but you can create it then

## After Creating the Table

Once the table is created:
- ✅ Local development: Will work (if .env is set)
- ✅ Production: Will work automatically (Vercel has DATABASE_URL)
- ✅ Test: Submit a registration on your website to verify
