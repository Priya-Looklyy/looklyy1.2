# Fix Registrations Table - Add Missing ID Column

## Issue
The table was created but is missing the `id` column that Prisma requires.

## Solution: Add the ID Column

Run this SQL in Supabase SQL Editor:

```sql
-- Add the missing id column as primary key
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text;

-- If the table already has data, update existing rows with IDs
UPDATE registrations 
SET id = gen_random_uuid()::text 
WHERE id IS NULL;

-- Make id NOT NULL (if it wasn't already)
ALTER TABLE registrations 
ALTER COLUMN id SET NOT NULL;
```

## Alternative: Drop and Recreate (if table is empty)

If you haven't added any data yet, you can drop and recreate:

```sql
-- Drop the table
DROP TABLE IF EXISTS registrations;

-- Recreate with all columns including id
CREATE TABLE registrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations("createdAt");
```

## Verify

After running the SQL, check the table structure:
1. Go to "Table Editor" in Supabase
2. Click on "registrations" table
3. Verify it has these columns:
   - ✅ id (TEXT, Primary Key)
   - ✅ email (TEXT, Unique, Not Null)
   - ✅ name (TEXT, Nullable)
   - ✅ createdAt (Timestamp)
   - ✅ updatedAt (Timestamp)
