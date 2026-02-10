# Deployment Guide for looklyy.com

## Prerequisites

- Vercel account connected to your GitHub repository
- Domain `looklyy.com` configured in Vercel (already done)

## Deployment Steps

### 1. Build and Test Locally

```bash
cd looklyy-demo
npm install
npm run build
npm start
```

Visit `http://localhost:3000` to preview the production build.

### 2. Deploy to Vercel

The site will automatically deploy when you push to your main branch. To deploy manually:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Verify Deployment

1. Visit https://looklyy.com
2. Test the registration form
3. Check analytics in Plausible dashboard
4. Verify SEO meta tags using: https://www.opengraph.xyz/url/https://looklyy.com

## Environment Variables

Currently, no environment variables are required. If you add a database or email service later, add them in:

**Vercel Dashboard → Project Settings → Environment Variables**

## Domain Configuration

The domain `looklyy.com` is already configured in Vercel. To verify:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Verify `looklyy.com` is listed and active

## Performance Optimization

The site is optimized for:
- ✅ Fast load times (compressed assets)
- ✅ SEO-friendly (meta tags, semantic HTML)
- ✅ Mobile responsive
- ✅ Accessibility (focus states, ARIA labels)
- ✅ Image optimization (Next.js Image component ready)

## Monitoring

- **Analytics**: Plausible dashboard
- **Performance**: Vercel Analytics (if enabled)
- **Errors**: Vercel logs in dashboard

## Troubleshooting

### Build Fails
- Check `next.config.ts` for syntax errors
- Verify all dependencies are in `package.json`
- Check TypeScript errors: `npm run build`

### Domain Not Working
- Verify DNS settings in Vercel
- Check domain status in Vercel dashboard
- Wait for DNS propagation (up to 48 hours)

### Analytics Not Tracking
- Verify Plausible script is loading (check browser console)
- Confirm domain is added in Plausible dashboard
- Check browser ad blockers (may block analytics)
