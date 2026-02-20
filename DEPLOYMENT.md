# Deployment Guide - Render

This guide will help you deploy the Product Marketplace application to Render.

## Prerequisites

- GitHub account with your repository
- Render account (free tier available at https://render.com)
- Your code pushed to GitHub

## Project Structure

The project is configured to work both locally and in production:
- **Local**: Uses SQLite database, runs on localhost
- **Production**: Uses PostgreSQL database, deployed on Render

## Deployment Steps

### 1. Prepare Your Repository

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create a Render Account

1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 3. Deploy Using render.yaml (Recommended)

#### Option A: Blueprint Deployment (Easiest)

1. Go to your Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**
6. Set the required environment variables:
   - `ALLOWED_HOSTS`: Your Render URL (e.g., `marketplace-backend.onrender.com`)
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)

#### Option B: Manual Deployment

If Blueprint doesn't work, follow these steps:

### 4. Create PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `marketplace-db`
3. Database: `marketplace`
4. User: `marketplace_user`
5. Region: Choose closest to you
6. Plan: Free tier
7. Click **"Create Database"**
8. Copy the **Internal Database URL** (starts with `postgresql://`)

### 5. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `marketplace-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `cd backend && gunicorn marketplace.wsgi:application`

4. Add Environment Variables:
   - `PYTHON_VERSION`: `3.11.0`
   - `SECRET_KEY`: Click "Generate" for a secure key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `marketplace-backend.onrender.com` (use your actual URL)
   - `DATABASE_URL`: Paste the Internal Database URL from step 4
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL (if separate)
   - `JWT_ACCESS_TOKEN_LIFETIME`: `60`
   - `JWT_REFRESH_TOKEN_LIFETIME`: `1440`
   - `OPENAI_API_KEY`: Your OpenAI key (optional)

5. Click **"Create Web Service"**

### 6. Wait for Deployment

- Render will build and deploy your application
- This may take 5-10 minutes for the first deployment
- Watch the logs for any errors

### 7. Create Sample Data (Optional)

Once deployed, you can create sample data:

1. Go to your service's **Shell** tab in Render
2. Run:
```bash
cd backend
python manage.py shell
```
3. Then run the sample data script:
```python
exec(open('create_sample_data.py').read())
```

Or create a superuser:
```bash
cd backend
python manage.py createsuperuser
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Auto-generated |
| `DEBUG` | Debug mode (False in production) | `False` |
| `ALLOWED_HOSTS` | Allowed hostnames | `marketplace-backend.onrender.com` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs | `https://frontend.vercel.app` |
| `JWT_ACCESS_TOKEN_LIFETIME` | Token lifetime in minutes | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME` | Refresh token lifetime | `1440` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | `sk-...` |

## Accessing Your Deployed API

Once deployed, your API will be available at:
- **API Base**: `https://marketplace-backend.onrender.com/api/`
- **Swagger Docs**: `https://marketplace-backend.onrender.com/swagger/`
- **Admin Panel**: `https://marketplace-backend.onrender.com/admin/`

## Frontend Deployment (Vercel/Netlify)

### Update Frontend API URL

Before deploying the frontend, update the API URL:

1. Create `.env.local` in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=https://marketplace-backend.onrender.com
```

2. Update `frontend/lib/api.ts` to use the environment variable:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set Root Directory to `frontend`
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

## Troubleshooting

### Build Fails

**Error**: `Could not open requirements file`
- **Solution**: Make sure `requirements.txt` exists in the root directory

**Error**: `No module named 'gunicorn'`
- **Solution**: Ensure `gunicorn` is in `backend/requirements.txt`

### Database Connection Issues

**Error**: `could not connect to server`
- **Solution**: Check that `DATABASE_URL` is set correctly
- Make sure the database is in the same region as your web service

### Static Files Not Loading

**Error**: 404 on static files
- **Solution**: Run `python manage.py collectstatic` in build command
- Check that `whitenoise` is installed and configured

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution**: Add your frontend URL to `CORS_ALLOWED_ORIGINS`
- Format: `https://your-frontend.vercel.app` (no trailing slash)

### Application Crashes

1. Check the logs in Render Dashboard
2. Look for Python errors or missing dependencies
3. Verify all environment variables are set
4. Check that migrations ran successfully

## Local Development

To run locally after deployment setup:

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## Updating Your Deployment

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically rebuild and redeploy your application.

## Free Tier Limitations

Render's free tier includes:
- 750 hours/month of runtime
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 512 MB RAM
- PostgreSQL database with 1GB storage

## Upgrading to Paid Plan

For production use, consider upgrading:
- No spin-down delays
- More RAM and CPU
- Better performance
- Custom domains
- Priority support

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Django Deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/

## Security Checklist

Before going to production:
- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Set up HTTPS (automatic on Render)
- [ ] Review CORS settings
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review user permissions
- [ ] Secure API keys in environment variables
