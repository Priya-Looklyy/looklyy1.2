# Check GitHub Webhooks for Vercel

## Important Note
The "No Webhooks for this project" screen you're seeing is **NORMAL**. Vercel uses **GitHub webhooks** (not project webhooks) when connected to Git repositories.

## Check GitHub Webhooks (This is what matters)

### Step 1: Go to GitHub Webhooks
1. Go to: https://github.com/Priya-Looklyy/looklyy1.2/settings/hooks
2. Look for a webhook with `vercel.com` in the URL
3. Check if it exists and if it's active

### Step 2: If Webhook is Missing or Broken
The webhook should look like:
- **Payload URL**: `https://api.vercel.com/v1/integrations/deploy/...`
- **Content type**: `application/json`
- **Events**: Should include "Push" events
- **Active**: Should be checked/enabled

### Step 3: Fix Broken Webhook
If webhook is missing or shows errors:
1. Go back to Vercel Dashboard → Settings → Git
2. Click **"Disconnect"**
3. Wait 10 seconds
4. Click **"Connect Git Repository"**
5. Select: `Priya-Looklyy/looklyy1.2`
6. Choose branch: `demo-looklyy` (or `master`)
7. Configure build settings
8. Click **"Deploy"**

This will recreate the GitHub webhook automatically.

## Alternative: Check Production Branch
1. In Vercel Dashboard → Settings → Git
2. Scroll down to find **"Production Branch"** setting
3. Make sure it matches the branch you're pushing to:
   - If you want `demo-looklyy` → set to `demo-looklyy`
   - If you want `master` → set to `master`

## Quick Test
After reconnecting, make a small change and push:
```bash
# Make a small change
echo "test" >> test.txt
git add test.txt
git commit -m "Test deployment trigger"
git push origin demo-looklyy
```

Then check Vercel Dashboard → Deployments to see if it triggers automatically.
