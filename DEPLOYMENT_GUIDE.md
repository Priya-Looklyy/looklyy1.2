# 🚀 Looklyy Production Deployment Guide

## Overview
This guide will help you deploy Looklyy to your GoDaddy domain `looklyy.com` with a professional setup.

## 🎯 Architecture
- **Frontend**: `looklyy.com` → Vercel (React app)
- **Backend API**: `api.looklyy.com` → Railway (Python FastAPI)
- **Database**: PostgreSQL on Railway
- **Images**: Railway file storage

## 📋 Prerequisites
- GoDaddy domain: `looklyy.com`
- GitHub account (already done ✅)
- Vercel account (free)
- Railway account (free)

## 🚀 Step 1: Deploy Backend API to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 1.2 Deploy API
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `Priya-Looklyy/looklyy1.2`
4. Railway will auto-detect Python and use `requirements.txt`
5. Set environment variables:
   ```
   PORT=8000
   NODE_ENV=production
   ```

### 1.3 Get Railway URL
- Railway will give you a URL like: `https://looklyy1-2-production-xxxx.up.railway.app`
- This will become your `api.looklyy.com`

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 2.2 Deploy React App
1. Click "Import Project"
2. Select `Priya-Looklyy/looklyy1.2`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   ```
   VITE_API_BASE_URL=https://api.looklyy.com
   ```

### 2.3 Get Vercel URL
- Vercel will give you: `https://looklyy1-2.vercel.app`
- This will become your `looklyy.com`

## 🔧 Step 3: Configure GoDaddy DNS

### 3.1 Access GoDaddy DNS
1. Log into GoDaddy
2. Go to "My Products" → "DNS"
3. Find `looklyy.com` and click "Manage"

### 3.2 Add DNS Records
Add these records:

```
Type: A
Name: @
Value: 76.76.19.19 (Vercel IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: api
Value: [Your Railway URL without https://]
```

### 3.3 Custom Domains in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add `looklyy.com` and `www.looklyy.com`
5. Follow DNS verification steps

### 3.4 Custom Domain in Railway
1. Go to Railway Dashboard
2. Select your API project
3. Go to "Settings" → "Domains"
4. Add `api.looklyy.com`
5. Update DNS with Railway's provided values

## 🧪 Step 4: Test Deployment

### 4.1 Test API
```bash
curl https://api.looklyy.com/health
curl https://api.looklyy.com/trends/latest?limit=5
```

### 4.2 Test Frontend
1. Visit `https://looklyy.com`
2. Check Trending page loads data from API
3. Verify all features work

## 🔄 Step 5: Set Up Real Crawler (Optional)

### 5.1 Add Environment Variables to Railway
```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=postgresql://...
```

### 5.2 Enable Real Crawling
- The production API currently uses mock data
- To enable real crawling, uncomment crawler code in `production_api.py`
- Add PostgreSQL database to Railway project

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics for frontend performance
- Monitor page views and user behavior

### Railway Metrics
- Monitor API performance
- Track database usage
- Set up alerts for downtime

## 🚨 Troubleshooting

### Common Issues:
1. **DNS not propagating**: Wait 24-48 hours
2. **CORS errors**: Check Railway CORS settings
3. **API not responding**: Check Railway logs
4. **Images not loading**: Verify static file serving

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- GoDaddy: [help.godaddy.com](https://help.godaddy.com)

## 🎉 Success!
Once deployed, you'll have:
- ✅ Professional domain: `looklyy.com`
- ✅ Fast API: `api.looklyy.com`
- ✅ Scalable infrastructure
- ✅ SSL certificates (automatic)
- ✅ Global CDN (Vercel)
- ✅ Real-time monitoring

Your Looklyy fashion app will be live and ready for users! 🎨✨
