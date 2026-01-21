# How to Check if Vercel is Down

## Official Vercel Status Page
**Direct Link**: https://www.vercel-status.com/

This is Vercel's official status page that shows:
- Current system status
- Recent incidents
- Service health for:
  - API
  - Dashboard
  - Deployments
  - Builds
  - Webhooks
  - CDN

## How to Check:

### Step 1: Visit Status Page
Go to: https://www.vercel-status.com/

### Step 2: Check Status Indicators
- 🟢 **Green** = All systems operational
- 🟡 **Yellow** = Partial outage or degraded performance
- 🔴 **Red** = Major outage

### Step 3: Check Recent Incidents
Scroll down to see:
- Recent incidents/outages
- When they occurred
- What services were affected
- Resolution status

### Step 4: Check Specific Services
Look for:
- **Deployments** - If down, deployments won't trigger
- **Webhooks** - If down, GitHub webhooks won't work
- **Builds** - If down, builds will fail
- **API** - If down, dashboard might not work

## Alternative: Check Vercel Twitter/X
**Link**: https://twitter.com/vercel_status

Vercel posts updates about outages and incidents here.

## Alternative: Check Downdetector
**Link**: https://downdetector.com/status/vercel/

Shows user-reported issues and outage patterns.

## What to Do if Vercel is Down:
1. **Wait** - Vercel usually resolves issues quickly
2. **Check Status Page** - Monitor for updates
3. **Try Again Later** - Once status shows green, try deploying again

## If Vercel is UP but Still Not Deploying:
Then the issue is definitely the webhook connection - follow the reconnect steps in DEFINITIVE_FIX.md
