# Analytics Setup Guide

## Plausible Analytics

The homepage is configured to use [Plausible Analytics](https://plausible.io/), a privacy-friendly analytics solution that is GDPR, CCPA, and PECR compliant.

### Setup Instructions

1. **Create a Plausible account** at https://plausible.io/
2. **Add your domain** (looklyy.com) in the Plausible dashboard
3. **Get your domain hash** from Plausible settings
4. **Update the script** in `src/app/page.tsx`:

```tsx
<Script
  strategy="afterInteractive"
  data-domain="looklyy.com"
  src="https://plausible.io/js/script.js"
/>
```

### Events Being Tracked

The homepage tracks the following custom events:

1. **Page Views** - Automatic on page load
2. **Scroll Depth** - Tracks when users scroll 25%, 50%, 75%, and 100%
3. **Time on Page** - Tracks total time spent on the page
4. **CTA Clicks** - Tracks clicks on call-to-action buttons with location context
5. **Form Interactions**:
   - `form_start` - When user starts filling the form
   - `form_error` - When form submission fails
   - `registration` - Successful registration with metadata:
     - `time_to_register` - Seconds from page load to registration
     - `has_name` - Whether user provided a name

### Viewing Analytics

1. Log in to your Plausible dashboard
2. Select the `looklyy.com` site
3. View metrics including:
   - Unique visitors
   - Page views
   - Conversion rate (visits → registrations)
   - Average time on page
   - Scroll depth distribution
   - CTA click rates by location
   - Form completion funnel

### Alternative Analytics Options

If you prefer a different analytics solution, you can replace Plausible with:

- **PostHog** - Open-source product analytics
- **Google Analytics 4** - Traditional analytics (requires cookie consent)
- **Vercel Analytics** - Built-in Vercel analytics
- **Mixpanel** - Product analytics

To switch analytics providers:
1. Update the `<Script>` tag in `src/app/page.tsx`
2. Update the `useAnalytics` hook to use your provider's API
3. Update event tracking calls as needed

### Privacy Compliance

Plausible Analytics:
- ✅ No cookies required
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ PECR compliant
- ✅ No personal data collection
- ✅ Lightweight (~1KB script)

No cookie banner is required when using Plausible.
