@echo off
echo ========================================
echo Product Marketplace Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo [2/4] Creating superuser...
echo Please create an admin account:
python manage.py createsuperuser

echo.
echo [3/4] Setting up Frontend...
cd ..\frontend

echo Installing dependencies...
call npm install

echo.
echo [4/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Add OPENAI_API_KEY to backend\.env file
echo 2. Start backend: cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo 4. Visit http://localhost:3000
echo ========================================
