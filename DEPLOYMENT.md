# Deployment Guide

This guide covers deploying the Product Marketplace to production.

---

## Pre-Deployment Checklist

### Backend
- [ ] Set `DEBUG = False` in settings.py
- [ ] Generate new `SECRET_KEY`
- [ ] Configure PostgreSQL database
- [ ] Set up environment variables
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up CORS properly
- [ ] Configure static files serving
- [ ] Set up SSL/HTTPS
- [ ] Configure email backend
- [ ] Set up logging
- [ ] Run security checks
- [ ] Create superuser account
- [ ] Run migrations
- [ ] Collect static files

### Frontend
- [ ] Update API_URL to production backend
- [ ] Configure environment variables
- [ ] Build production bundle
- [ ] Test production build locally
- [ ] Configure CDN for assets
- [ ] Set up error tracking

### Infrastructure
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up logging aggregation
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and DNS
- [ ] Set up SSL certificates

---

## Deployment Options

### Option 1: Heroku (Easiest)

#### Backend Deployment

1. **Install Heroku CLI**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Prepare Backend**
```bash
cd backend

# Create Procfile
echo "web: gunicorn marketplace.wsgi" > Procfile

# Add gunicorn to requirements.txt
echo "gunicorn==21.2.0" >> requirements.txt
echo "psycopg2-binary==2.9.9" >> requirements.txt
echo "dj-database-url==2.1.0" >> requirements.txt
```

3. **Update settings.py**
```python
# Add at the top
import dj_database_url

# Update DATABASES
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# Update ALLOWED_HOSTS
ALLOWED_HOSTS = ['your-app.herokuapp.com', 'localhost']

# Add static files config
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

4. **Deploy**
```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set OPENAI_API_KEY=your_key
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Update API URL**
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

3. **Deploy**
```bash
cd frontend
vercel
# Follow prompts
# Set environment variable: NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
```

---

### Option 2: AWS (Production-Ready)

#### Backend on AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize**
```bash
cd backend
eb init -p python-3.11 product-marketplace
eb create product-marketplace-env
```

3. **Configure RDS**
```bash
# Create RDS PostgreSQL instance
# Update settings.py with RDS credentials
```

4. **Deploy**
```bash
eb deploy
```

#### Frontend on AWS Amplify

1. **Connect Repository**
- Go to AWS Amplify Console
- Connect your GitHub repository
- Configure build settings

2. **Build Settings**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

---

### Option 3: Docker (Flexible)

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "marketplace.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: marketplace
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: gunicorn marketplace.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/marketplace
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Environment Variables

### Backend (.env)
```bash
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
OPENAI_API_KEY=your-openai-key
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## Database Migration

### From SQLite to PostgreSQL

1. **Dump SQLite data**
```bash
python manage.py dumpdata > data.json
```

2. **Configure PostgreSQL**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'marketplace',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. **Migrate and load data**
```bash
python manage.py migrate
python manage.py loaddata data.json
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

1. **Install Certbot**
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

2. **Get Certificate**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. **Auto-renewal**
```bash
sudo certbot renew --dry-run
```

---

## Monitoring Setup

### Sentry (Error Tracking)

1. **Install**
```bash
pip install sentry-sdk
```

2. **Configure**
```python
# settings.py
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

### Application Monitoring

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## Performance Optimization

### Backend

1. **Database Indexing**
```python
# models.py
class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    status = models.CharField(max_length=20, db_index=True)
```

2. **Query Optimization**
```python
# Use select_related and prefetch_related
products = Product.objects.select_related('business', 'created_by').all()
```

3. **Caching**
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Frontend

1. **Image Optimization**
```typescript
import Image from 'next/image'

<Image src="/product.jpg" width={500} height={300} alt="Product" />
```

2. **Code Splitting**
```typescript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/Heavy'))
```

---

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump marketplace > /backups/marketplace_$DATE.sql
# Keep only last 30 days
find /backups -name "marketplace_*.sql" -mtime +30 -delete
```

### Automated Backups (AWS)
- Enable automated RDS backups
- Set retention period to 7-30 days
- Configure backup window

---

## Security Hardening

### Django Settings

```python
# Production security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Rate Limiting

```python
# Install django-ratelimit
pip install django-ratelimit

# views.py
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='100/h')
def my_view(request):
    pass
```

---

## Post-Deployment

1. **Test all endpoints**
2. **Verify authentication works**
3. **Test product creation and approval**
4. **Test chatbot functionality**
5. **Check error logging**
6. **Monitor performance**
7. **Set up alerts**
8. **Document any issues**

---

## Rollback Plan

1. **Keep previous version tagged**
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. **Database backup before migration**
3. **Quick rollback command**
```bash
git checkout v1.0.0
eb deploy  # or your deployment command
```

---

## Support & Maintenance

### Regular Tasks
- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Database optimization quarterly
- [ ] Backup verification monthly

### Emergency Contacts
- DevOps Team: devops@company.com
- Database Admin: dba@company.com
- Security Team: security@company.com

---

## Cost Estimation (AWS)

### Development
- EC2 t3.micro: $8/month
- RDS db.t3.micro: $15/month
- S3 Storage: $1/month
- **Total: ~$25/month**

### Production
- EC2 t3.medium (2x): $60/month
- RDS db.t3.small: $30/month
- ElastiCache: $15/month
- S3 + CloudFront: $10/month
- Load Balancer: $20/month
- **Total: ~$135/month**

---

## Troubleshooting

### Common Issues

**Issue**: Static files not loading
```bash
python manage.py collectstatic
```

**Issue**: Database connection error
```bash
# Check DATABASE_URL
echo $DATABASE_URL
# Test connection
psql $DATABASE_URL
```

**Issue**: CORS errors
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]
```

---

## Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/)
- [12 Factor App](https://12factor.net/)
