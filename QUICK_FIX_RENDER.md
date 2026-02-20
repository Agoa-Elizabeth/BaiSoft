# Quick Fix for Current Render Error

## The Problem

Your deployment is failing with:
```
ModuleNotFoundError: No module named 'mymarket'
```

This is because Render is using the wrong start command. It's trying to run `gunicorn mymarket.wsgi` but your Django project is named `marketplace`.

## The Solution (2 Minutes)

### Option 1: Update in Render Dashboard (Easiest)

1. Go to https://dashboard.render.com
2. Click on your web service
3. Click **"Settings"** in the left sidebar
4. Scroll down to **"Start Command"**
5. Replace the current command with:
   ```bash
   cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT
   ```
6. Click **"Save Changes"**
7. Render will automatically redeploy

### Option 2: Update render.yaml and Redeploy

If you're using the render.yaml file:

1. The file has already been updated in your local repository
2. Commit and push the changes:
   ```bash
   git add render.yaml RENDER_QUICK_START.md DEPLOYMENT.md
   git commit -m "Fix start command for Render deployment"
   git push origin main
   ```
3. Render will automatically redeploy with the correct command

## What Changed

**Before (Wrong):**
```bash
gunicorn mymarket.wsgi
```

**After (Correct):**
```bash
cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT
```

## Why This Happened

The error occurred because:
1. Your Django project folder is named `marketplace` (not `mymarket`)
2. The WSGI file is at `backend/marketplace/wsgi.py`
3. Render needs to `cd backend` first, then run gunicorn
4. The `--bind 0.0.0.0:$PORT` ensures it binds to Render's assigned port

## Verify the Fix

After updating and redeploying, check:

1. **Build logs** - Should complete successfully
2. **Deploy logs** - Should show:
   ```
   [INFO] Starting gunicorn 21.2.0
   [INFO] Listening at: http://0.0.0.0:10000
   ```
3. **Service status** - Should show "Live" (green)
4. **Test API** - Visit `https://your-app.onrender.com/swagger/`

## Next Steps After Fix

Once the service is running:

1. **Create a superuser:**
   - Go to Render Shell
   - Run:
     ```bash
     cd backend
     python manage.py createsuperuser
     ```

2. **Test the API:**
   - Visit: `https://your-app.onrender.com/swagger/`
   - Try the `/api/products/public/` endpoint

3. **Update frontend:**
   - Set `NEXT_PUBLIC_API_URL` to your Render URL
   - Deploy frontend

## If Still Not Working

Check these:

- [ ] `DATABASE_URL` is set in environment variables
- [ ] `SECRET_KEY` is set (click Generate in Render)
- [ ] `ALLOWED_HOSTS` includes your Render URL
- [ ] `DEBUG` is set to `False`

See `RENDER_TROUBLESHOOTING.md` for more detailed help.

---

**Estimated Time to Fix:** 2-3 minutes
**Difficulty:** Easy - Just update one setting
