# Pre-Deployment Checklist

Before deploying to Render, verify these items:

## ✅ Code Repository

- [ ] All changes committed to Git
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] Branch is `main` or `master`

## ✅ Required Files Present

- [ ] `requirements.txt` in root directory
- [ ] `backend/requirements.txt` with all dependencies
- [ ] `build.sh` in root directory
- [ ] `render.yaml` in root directory (optional but recommended)
- [ ] `.gitignore` includes `staticfiles/`

## ✅ Backend Configuration

- [ ] `dj-database-url` in requirements
- [ ] `gunicorn` in requirements
- [ ] `psycopg2-binary` in requirements
- [ ] `whitenoise` in requirements
- [ ] Settings.py has database auto-detection
- [ ] Settings.py has whitenoise middleware
- [ ] Settings.py has STATIC_ROOT configured

## ✅ Frontend Configuration

- [ ] `frontend/lib/api.ts` uses environment variable
- [ ] `frontend/.env.example` exists
- [ ] API URL can be configured via `NEXT_PUBLIC_API_URL`

## ✅ Environment Variables Ready

Prepare these values before deployment:

### Required
- [ ] `SECRET_KEY` - Will generate in Render
- [ ] `DEBUG` - Set to `False`
- [ ] `ALLOWED_HOSTS` - Your Render URL
- [ ] `DATABASE_URL` - From Render database

### Optional
- [ ] `CORS_ALLOWED_ORIGINS` - Frontend URL
- [ ] `OPENAI_API_KEY` - For AI features
- [ ] `JWT_ACCESS_TOKEN_LIFETIME` - Default: 60
- [ ] `JWT_REFRESH_TOKEN_LIFETIME` - Default: 1440

## ✅ Local Testing

Before deploying, test locally:

```bash
# Backend
cd backend
python manage.py migrate
python manage.py runserver
# Visit: http://localhost:8000/swagger/

# Frontend
cd frontend
npm install
npm run dev
# Visit: http://localhost:3000
```

- [ ] Backend runs without errors
- [ ] Frontend connects to backend
- [ ] Can login successfully
- [ ] Can create/view products
- [ ] Swagger docs accessible
- [ ] No console errors

## ✅ Documentation Review

- [ ] Read `RENDER_QUICK_START.md`
- [ ] Understand environment variables
- [ ] Know how to access Render shell
- [ ] Familiar with Render dashboard

## ✅ Deployment Plan

1. [ ] Create Render account
2. [ ] Create PostgreSQL database
3. [ ] Copy database URL
4. [ ] Create web service
5. [ ] Set environment variables
6. [ ] Wait for build
7. [ ] Create superuser
8. [ ] Test API endpoints
9. [ ] Deploy frontend (if separate)
10. [ ] Update frontend API URL

## ✅ Post-Deployment Testing

After deployment, verify:

- [ ] API responds: `https://your-app.onrender.com/api/`
- [ ] Swagger works: `https://your-app.onrender.com/swagger/`
- [ ] Admin panel: `https://your-app.onrender.com/admin/`
- [ ] Can login via API
- [ ] Can create products
- [ ] Public products endpoint works
- [ ] No 500 errors in logs

## ✅ Security Verification

- [ ] `DEBUG=False` in production
- [ ] Strong secret key generated
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS configured correctly
- [ ] No sensitive data in code
- [ ] Database credentials secure

## Common Issues Checklist

If deployment fails, check:

- [ ] `requirements.txt` exists in root
- [ ] `build.sh` has correct commands
- [ ] All dependencies listed in requirements
- [ ] Python version compatible (3.11 recommended)
- [ ] Database URL format correct
- [ ] No syntax errors in settings.py
- [ ] Migrations can run successfully
- [ ] Static files collect without errors

## Ready to Deploy?

If all items are checked, you're ready! Follow these guides:

1. **Quick Start**: `RENDER_QUICK_START.md`
2. **Detailed Guide**: `DEPLOYMENT.md`
3. **Summary**: `DEPLOYMENT_SUMMARY.md`

## Need Help?

- Check Render logs for errors
- Review `DEPLOYMENT.md` troubleshooting section
- Verify environment variables are set correctly
- Ensure database is in same region as web service

---

**Last Updated**: Before deployment
**Status**: Ready for deployment ✅
