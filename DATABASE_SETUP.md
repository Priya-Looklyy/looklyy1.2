# 🗄️ Database Setup Guide for Looklyy

This guide will help you set up a production-ready database for Looklyy's authentication system.

## 🚀 Quick Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Database URL**
   - Go to Settings → Database
   - Copy the "Connection string" (URI)
   - It looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

3. **Configure Environment**
   ```bash
   cp env.example .env
   ```
   - Update `.env` with your database URL
   - Generate a strong JWT secret

### Option 2: Railway PostgreSQL

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up and create a new project
   - Add PostgreSQL database

2. **Get Connection String**
   - Copy the DATABASE_URL from Railway dashboard
   - Add to your `.env` file

### Option 3: Neon (Serverless PostgreSQL)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up and create a project
   - Copy the connection string

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Setup Script**
   ```bash
   node scripts/setup-database.js
   ```

3. **Manual Setup (if script fails)**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   ```

## 📋 Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# API Configuration
API_BASE_URL="https://looklyy.com/api"

# Environment
NODE_ENV="development"
```

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Secure session management with 7-day expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Proper CORS headers for API security

## 📊 Database Schema

### Users Table
- `id`: Unique user identifier
- `email`: User email (unique)
- `name`: User display name
- `password`: Hashed password
- `avatar`: Profile picture URL
- `preferences`: JSON user preferences
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Look Favorites
- `id`: Unique identifier
- `userId`: Reference to user
- `lookId`: Reference to fashion look
- `createdAt`: Favorite timestamp

### Look Pins
- `id`: Unique identifier
- `userId`: Reference to user
- `lookId`: Reference to fashion look
- `createdAt`: Pin timestamp

## 🛠️ Development Tools

### Prisma Studio
View and edit your database:
```bash
npx prisma studio
```

### Database Migrations
Create migration files:
```bash
npx prisma migrate dev --name init
```

### Reset Database
Reset and recreate database:
```bash
npx prisma migrate reset
```

## 🚀 Deployment

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Deploy your app
3. Run database setup in production

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Request/Response Examples

#### Signup
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://ui-avatars.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { /* user object */ },
  "token": "jwt_token_here"
}
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database server is running
   - Verify credentials

2. **Prisma Client Not Generated**
   ```bash
   npx prisma generate
   ```

3. **Schema Push Failed**
   ```bash
   npx prisma db push --force-reset
   ```

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

### Getting Help

- Check Prisma documentation: [prisma.io/docs](https://prisma.io/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Railway docs: [docs.railway.app](https://docs.railway.app)

## ✅ Verification

Test your setup:

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Test signup endpoint**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. **Check database**
   ```bash
   npx prisma studio
   ```

Your database is ready! 🎉
