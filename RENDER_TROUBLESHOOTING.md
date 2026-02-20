# Render Deployment Troubleshooting

## Common Errors and Solutions

### 1. ModuleNotFoundError: No module named 'mymarket'

**Error Message:**
```
ModuleNotFoundError: No module named 'mymarket'
```

**Cause:** The start command is using the wrong Django project name.

**Solution:** Update the start command in Render dashboard:
```bash
cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT
```

**Where to fix:**
1. Go to your Render service dashboard
2. Click on your web service
3. Go to "Settings"
4. Find "Start Command"
5. Update to: `cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT`
6. Click "Save Changes"
7. Render will automatically redeploy

---

### 2. requirements.txt not found

**Error Message:**
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

**Cause:** Render is looking for requirements.txt in the root directory.

**Solution:** We've already created `requirements.txt` in the root that points to `backend/requirements.txt`. Make sure it's committed:
```bash
git add requirements.txt
git commit -m "Add root requirements.txt"
git push
```

---

### 3. Build Script Permission Denied

**Error Message:**
```
./build.sh: Permission denied
```

**Solution:** Make the build script executable:
```bash
chmod +x build.sh
git add build.sh
git commit -m "Make build.sh executable"
git push
```

Or update the build command in Render to:
```bash
bash build.sh
```

---

### 4. Database Connection Error

**Error Message:**
```
django.db.utils.OperationalError: could not connect to server
```

**Cause:** DATABASE_URL not set or incorrect.

**Solution:**
1. Go to your PostgreSQL database in Render
2. Copy the **Internal Database URL**
3. Go to your web service → Settings → Environment
4. Add/update `DATABASE_URL` with the copied URL
5. Save and redeploy

**Important:** Use the **Internal** database URL, not the external one.

---

### 5. Static Files 404

**Error Message:**
Static files return 404 errors.

**Solution:**
1. Ensure `whitenoise` is in requirements.txt ✅ (already added)
2. Check that `collectstatic` runs in build.sh ✅ (already configured)
3. Verify STATIC_ROOT in settings.py ✅ (already set)

If still not working, check Render logs during build for collectstatic errors.

---

### 6. CORS Errors from Frontend

**Error Message:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. Go to Render service → Settings → Environment
2. Add `CORS_ALLOWED_ORIGINS` variable
3. Set value to your frontend URL (e.g., `https://your-frontend.vercel.app`)
4. **Important:** No trailing slash!
5. Save and redeploy

For multiple origins, separate with commas:
```
https://frontend1.com,https://frontend2.com
```

---

### 7. SECRET_KEY Error

**Error Message:**
```
django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty
```

**Solution:**
1. Go to Render service → Settings → Environment
2. Click "Add Environment Variable"
3. Key: `SECRET_KEY`
4. Click "Generate" button for a secure random key
5. Save and redeploy

---

### 8. Migration Errors

**Error Message:**
```
django.db.migrations.exceptions.InconsistentMigrationHistory
```

**Solution:**
This usually happens when the database has old migrations.

**Option 1 - Fresh Database (Development):**
1. Delete the PostgreSQL database in Render
2. Create a new one
3. Update DATABASE_URL in web service
4. Redeploy

**Option 2 - Fix Migrations:**
1. Go to Render Shell
2. Run:
```bash
cd backend
python manage.py migrate --fake-initial
```

---

### 9. Port Binding Error

**Error Message:**
```
Error: bind(): Cannot assign requested address
```

**Cause:** Gunicorn not binding to the correct port.

**Solution:** Ensure start command includes `--bind 0.0.0.0:$PORT`:
```bash
cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT
```

Render automatically sets the `$PORT` environment variable.

---

### 10. Python Version Mismatch

**Error Message:**
```
ERROR: This package requires Python >=3.11
```

**Solution:**
1. Go to Render service → Settings → Environment
2. Add `PYTHON_VERSION` variable
3. Set value to `3.11.0`
4. Save and redeploy

---

### 11. Service Keeps Spinning Down

**Issue:** Service goes to sleep after 15 minutes of inactivity.

**Cause:** This is normal behavior on Render's free tier.

**Solutions:**
- **Upgrade to paid plan** ($7/month) - No spin down
- **Use a ping service** - Keep service awake (e.g., UptimeRobot)
- **Accept the delay** - First request after sleep takes 30-60 seconds

---

### 12. Build Takes Too Long / Times Out

**Solution:**
1. Check if all dependencies are necessary
2. Use specific package versions (already done ✅)
3. Consider upgrading to a paid plan for faster builds

---

## Checking Logs

To debug issues, check the logs:

1. Go to your Render service dashboard
2. Click on "Logs" tab
3. Look for error messages (usually in red)
4. Check both build logs and runtime logs

**Common log locations:**
- **Build logs**: Show pip install, migrations, collectstatic
- **Runtime logs**: Show gunicorn startup and request errors

---

## Using Render Shell

To run commands directly on your deployed service:

1. Go to your Render service dashboard
2. Click on "Shell" tab
3. Wait for shell to connect
4. Run commands:

```bash
# Navigate to backend
cd backend

# Check Django version
python manage.py --version

# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Check database connection
python manage.py dbshell

# Create sample data
python manage.py shell
>>> exec(open('create_sample_data.py').read())
```

---

## Environment Variables Checklist

Ensure these are set in Render:

**Required:**
- [ ] `SECRET_KEY` - Generated
- [ ] `DEBUG` - Set to `False`
- [ ] `ALLOWED_HOSTS` - Your Render URL
- [ ] `DATABASE_URL` - From PostgreSQL database

**Optional but Recommended:**
- [ ] `PYTHON_VERSION` - `3.11.0`
- [ ] `CORS_ALLOWED_ORIGINS` - Frontend URL
- [ ] `OPENAI_API_KEY` - For AI features
- [ ] `JWT_ACCESS_TOKEN_LIFETIME` - `60`
- [ ] `JWT_REFRESH_TOKEN_LIFETIME` - `1440`

---

## Quick Fix Commands

If you need to update your deployment quickly:

```bash
# Update start command (if wrong project name)
# Go to Render Dashboard → Settings → Start Command
cd backend && gunicorn marketplace.wsgi:application --bind 0.0.0.0:$PORT

# Force redeploy
# Go to Render Dashboard → Manual Deploy → Deploy latest commit

# Clear build cache
# Go to Render Dashboard → Settings → Clear Build Cache
```

---

## Still Having Issues?

1. **Check this guide first** - Most issues are covered here
2. **Review logs** - Error messages usually point to the problem
3. **Verify environment variables** - Missing or incorrect values cause most issues
4. **Check Render status** - https://status.render.com
5. **Render community** - https://community.render.com
6. **Render docs** - https://render.com/docs

---

## Success Checklist

Your deployment is successful when:

- [ ] Build completes without errors
- [ ] Service shows "Live" status
- [ ] API responds: `https://your-app.onrender.com/api/`
- [ ] Swagger UI loads: `https://your-app.onrender.com/swagger/`
- [ ] Admin panel accessible: `https://your-app.onrender.com/admin/`
- [ ] Can login via API
- [ ] Database queries work
- [ ] No errors in logs

---

**Last Updated:** After fixing ModuleNotFoundError
**Status:** Ready for deployment ✅
