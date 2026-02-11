# Verify Database Setup - Next Steps

## ✅ Database Created Successfully!

Your Supabase database "Pre-Registrations" has been created in Vercel.

## Step 1: Verify Environment Variable

1. Go to **Vercel Dashboard** → Your Project (`Looklyy`)
2. Navigate to **Settings** → **Environment Variables**
3. Look for `DATABASE_URL` - it should be automatically added
4. The value should look like: `postgresql://postgres:password@host.vercel-storage.com:5432/verceldb`

If `DATABASE_URL` is NOT there:
- Click "Add New"
- Name: `DATABASE_URL`
- Value: Copy from Supabase dashboard (Settings → Database → Connection string)
- Environment: Production, Preview, Development (select all)
- Click "Save"

## Step 2: Run Database Migration

After verifying DATABASE_URL exists, run this command locally:

```bash
cd looklyy-demo
npm run db:push
```

This will create the `registrations` table in your database.

## Step 3: Test the Connection

1. Start your local dev server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000
3. Submit a test registration
4. Check if it saved:
   ```bash
   npm run db:studio
   ```
   This opens Prisma Studio at http://localhost:5555 where you can see your registrations.

## Step 4: Deploy to Production

Once local testing works:
1. Push your code to GitHub (already done)
2. Vercel will automatically redeploy
3. The database connection will work in production automatically

## Troubleshooting

### Error: "Can't reach database server"
- Check DATABASE_URL is correct in Vercel
- Verify the database is active in Supabase dashboard

### Error: "Relation does not exist"
- Run `npm run db:push` to create tables

### Error: "Prisma Client not generated"
- Run `npm run db:generate`
