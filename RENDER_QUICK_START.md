# Quick Start - Deploy to Render

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## Step 2: Create Render Account
- Go to https://render.com
- Sign up with GitHub

## Step 3: Deploy Backend

### Create Database
1. New + → PostgreSQL
2. Name: `marketplace-db`
3. Create Database
4. Copy **Internal Database URL**

### Create Web Service
1. New + → Web Service
2. Connect your repo
3. Settings:
   - **Build Command**: `./build.sh`
   - **Start Command**: `cd backend && gunicorn marketplace.wsgi:application`

4. Environment Variables (click "Add Environment Variable"):
   ```
   SECRET_KEY = [Generate]
   DEBUG = False
   ALLOWED_HOSTS = your-app-name.onrender.com
   DATABASE_URL = [Paste from database]
   CORS_ALLOWED_ORIGINS = http://localhost:3000
   JWT_ACCESS_TOKEN_LIFETIME = 60
   JWT_REFRESH_TOKEN_LIFETIME = 1440
   ```

5. Click **Create Web Service**

## Step 4: Wait for Build
- Takes 5-10 minutes
- Watch logs for errors

## Step 5: Create Admin User

In Render Shell:
```bash
cd backend
python manage.py createsuperuser
```

## Step 6: Test Your API
- API: `https://your-app-name.onrender.com/api/`
- Swagger: `https://your-app-name.onrender.com/swagger/`
- Admin: `https://your-app-name.onrender.com/admin/`

## Common Issues

### Build fails with "requirements.txt not found"
✅ Fixed! We added `requirements.txt` in root directory

### Database connection error
- Make sure `DATABASE_URL` is set correctly
- Use **Internal Database URL** from your Render database

### CORS errors from frontend
- Add your frontend URL to `CORS_ALLOWED_ORIGINS`
- Format: `https://your-frontend.vercel.app` (no trailing slash)

## Local Development Still Works!

```bash
cd backend
python manage.py runserver
```

The app automatically uses SQLite locally and PostgreSQL in production.

## Need Help?
See full guide: `DEPLOYMENT.md`
