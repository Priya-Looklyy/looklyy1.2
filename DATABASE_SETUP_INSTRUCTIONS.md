# Database Setup Instructions for Email Registrations

## Overview
The registration system now saves email addresses to a PostgreSQL database using Prisma ORM.

## Prerequisites
- PostgreSQL database (local or cloud)
- Node.js and npm installed

## Setup Steps

### 1. Set Up Database

Choose one of these options:

#### Option A: Vercel Postgres (Recommended for Production)
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string

#### Option B: Supabase (Free tier available)
1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (use the "URI" format)

#### Option C: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb looklyy`
3. Connection string: `postgresql://username:password@localhost:5432/looklyy`

### 2. Configure Environment Variables

Create a `.env` file in the root directory (`looklyy-demo/.env`):

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Example for Vercel Postgres:
# DATABASE_URL="postgres://default:password@host.vercel-storage.com:5432/verceldb"

# Example for Supabase:
# DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
```

**Important:** Never commit `.env` to git! It should already be in `.gitignore`.

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or use migrations (for production):
npm run db:migrate
```

### 4. Verify Setup

You can verify the database is working by:

1. **Check Prisma Studio** (visual database browser):
   ```bash
   npm run db:studio
   ```
   This opens a browser at http://localhost:5555 where you can see your registrations.

2. **Test the registration endpoint**:
   - Submit a registration form on the website
   - Check Prisma Studio to see the new entry

## Database Schema

The `Registration` model stores:
- `id`: Unique identifier (auto-generated)
- `email`: User's email address (unique, required)
- `name`: User's name (optional)
- `createdAt`: Timestamp when registered
- `updatedAt`: Timestamp when last updated

## Viewing Registrations

### Using Prisma Studio
```bash
npm run db:studio
```

### Using SQL
```sql
SELECT * FROM registrations ORDER BY "createdAt" DESC;
```

### Using Prisma Client (in code)
```typescript
import { prisma } from '@/lib/prisma';

const registrations = await prisma.registration.findMany({
  orderBy: { createdAt: 'desc' }
});
```

## Troubleshooting

### Error: "Can't reach database server"
- Check your `DATABASE_URL` is correct
- Verify database is running (if local)
- Check firewall/network settings

### Error: "Relation does not exist"
- Run `npm run db:push` to create tables

### Error: "Prisma Client not generated"
- Run `npm run db:generate`

## Production Deployment

### Vercel
1. Add `DATABASE_URL` to Vercel environment variables
2. Vercel will automatically run `prisma generate` during build
3. Run migrations manually or set up a migration script

### Other Platforms
1. Set `DATABASE_URL` as environment variable
2. Run `npm run db:generate` during build
3. Run `npm run db:push` or migrations after deployment

## Next Steps (Optional Enhancements)

1. **Email Confirmation**: Send confirmation email using Resend or SendGrid
2. **Email Marketing**: Integrate with Mailchimp, ConvertKit, etc.
3. **Admin Dashboard**: Create admin page to view registrations
4. **Export**: Add CSV export functionality
5. **Analytics**: Track registration sources, conversion rates, etc.
