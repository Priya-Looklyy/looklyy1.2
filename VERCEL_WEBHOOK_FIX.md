# Fix Vercel Webhook Connection

## Current Status
- ✅ Repository Connected: `Priya-Looklyy/looklyy1.2`
- ✅ Connected Date: 9/22/25
- ❌ Deployments not triggering automatically

## Problem: Webhook Not Working

Even though the repository shows as "Connected", the webhook might be broken or not receiving events.

## Solution: Refresh the Connection

### Option 1: Disconnect and Reconnect (Recommended)
1. In Vercel Dashboard → Settings → Git
2. Click **"Disconnect"** button
3. Wait 10 seconds
4. Click **"Connect Git Repository"**
5. Select: `Priya-Looklyy/looklyy1.2`
6. **Important**: Select the correct branch:
   - If deploying demo: Choose `demo-looklyy`
   - If deploying production: Choose `master`
7. Configure build settings:
   - Framework: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
8. Click **"Deploy"**

### Option 2: Check GitHub Webhooks
1. Go to: https://github.com/Priya-Looklyy/looklyy1.2/settings/hooks
2. Look for Vercel webhook (should have `vercel.com` in URL)
3. Check recent deliveries - if they show errors, the webhook is broken
4. If broken, use Option 1 to reconnect

### Option 3: Check Production Branch Setting
1. In Vercel Dashboard → Settings → Git
2. Scroll down to find **"Production Branch"** setting
3. Verify it matches the branch you're pushing to:
   - If pushing to `demo-looklyy`, set Production Branch to `demo-looklyy`
   - If pushing to `master`, set Production Branch to `master`

### Option 4: Manual Deploy via Vercel CLI
If webhook still doesn't work:

```bash
npm install -g vercel
cd "C:\Users\Priya\OneDrive\Desktop\Looklyy1.2"
vercel login
vercel --prod
```

## Most Likely Fix:
**Disconnect and reconnect** (Option 1) - This refreshes the webhook connection and usually fixes the issue.
