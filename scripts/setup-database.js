#!/usr/bin/env node

// Database Setup Script for Looklyy
// This script helps you set up the database and run initial migrations

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

console.log('🚀 Setting up Looklyy Database...\n')

// Check if .env file exists
const envPath = join(process.cwd(), '.env')
if (!existsSync(envPath)) {
  console.log('❌ .env file not found!')
  console.log('📝 Please create a .env file with your database configuration.')
  console.log('📋 Copy env.example to .env and update the DATABASE_URL')
  console.log('\nExample .env file:')
  console.log('DATABASE_URL="postgresql://username:password@localhost:5432/looklyy?schema=public"')
  console.log('JWT_SECRET="your-super-secret-jwt-key"')
  process.exit(1)
}

// Read .env file
const envContent = readFileSync(envPath, 'utf8')
const hasDatabaseUrl = envContent.includes('DATABASE_URL=')
const hasJwtSecret = envContent.includes('JWT_SECRET=')

if (!hasDatabaseUrl) {
  console.log('❌ DATABASE_URL not found in .env file!')
  console.log('📝 Please add your database connection string to .env')
  process.exit(1)
}

if (!hasJwtSecret) {
  console.log('⚠️  JWT_SECRET not found in .env file!')
  console.log('📝 Please add a JWT secret to .env for security')
}

console.log('✅ Environment configuration found')

try {
  // Install dependencies
  console.log('\n📦 Installing dependencies...')
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed')

  // Generate Prisma client
  console.log('\n🔧 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated')

  // Push database schema
  console.log('\n🗄️  Setting up database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Database schema created')

  console.log('\n🎉 Database setup complete!')
  console.log('\n📋 Next steps:')
  console.log('1. Your database is ready to use')
  console.log('2. Start your development server: npm run dev')
  console.log('3. View your database: npx prisma studio')
  console.log('\n🔗 Database providers:')
  console.log('• Supabase: https://supabase.com (Recommended)')
  console.log('• Railway: https://railway.app')
  console.log('• Neon: https://neon.tech')

} catch (error) {
  console.error('\n❌ Setup failed:', error.message)
  console.log('\n🔧 Troubleshooting:')
  console.log('1. Make sure your DATABASE_URL is correct')
  console.log('2. Ensure your database server is running')
  console.log('3. Check your internet connection')
  process.exit(1)
}
