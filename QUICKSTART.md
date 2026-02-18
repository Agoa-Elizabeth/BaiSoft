# Quick Start Guide

## Fastest Way to Get Started

### Option 1: Automated Setup (Windows)
```bash
# Run the setup script
setup.bat
```

### Option 2: Manual Setup

#### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py shell < create_sample_data.py
python manage.py runserver
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## Test Accounts

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin | admin123 | Admin | Full access |
| editor | editor123 | Editor | Create/Edit products |
| approver | approver123 | Approver | Approve products |
| viewer | viewer123 | Viewer | View only |

## Quick Test Flow

1. **Public View**: Visit http://localhost:3000 to see approved products
2. **Login**: Go to http://localhost:3000/login and login as `editor`
3. **Create Product**: Click "Create Product" and add a new product
4. **Logout & Login as Approver**: Login as `approver`
5. **Approve Product**: Click "Approve" on the pending product
6. **View Public**: Logout and check the home page - your product is now visible
7. **AI Chatbot**: Visit http://localhost:3000/products/chatbot and ask about products

## AI Chatbot Setup

To enable the AI chatbot:

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Create `backend/.env` file:
```
OPENAI_API_KEY=your_key_here
```
3. Restart the backend server

## Running Tests

```bash
cd backend
python manage.py test
```

## Common Issues

**Issue**: Port already in use
**Solution**: Change port in commands
```bash
# Backend
python manage.py runserver 8001

# Frontend
npm run dev -- -p 3001
```

**Issue**: Module not found
**Solution**: Ensure virtual environment is activated and dependencies installed

**Issue**: Database errors
**Solution**: Delete db.sqlite3 and run migrations again

## API Testing with curl

```bash
# Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get products (replace TOKEN)
curl http://localhost:8000/api/products/ \
  -H "Authorization: Bearer TOKEN"

# Create product
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","description":"Test","price":"99.99"}'
```

## Next Steps

- Customize the business logic in `backend/core/models.py`
- Add more UI components in `frontend/app/`
- Extend the API in `backend/core/views.py`
- Add product images and categories
- Implement email notifications
