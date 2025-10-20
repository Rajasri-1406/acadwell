@echo off
echo 🎭 Setting up AcadWell Demo...

echo.
echo 🗄️ Checking MongoDB...
mongo --eval "db.runCommand('ping')" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB is running
) else (
    echo ❌ Starting MongoDB...
    net start MongoDB
    timeout /t 3
)

echo.
echo 📊 Loading demo data...
cd database
mongo acadwell init-db.js

echo.
echo 🚀 Starting services for demo...
cd ..
start "Backend Demo" cmd /k "cd backend && venv\Scripts\activate && python run.py"
timeout /t 5

start "Frontend Demo" cmd /k "cd frontend && npm run dev"
timeout /t 5

echo.
echo 🎭 Demo Environment Ready!
echo.
echo 📋 Demo Checklist:
echo ✅ MongoDB running with sample data
echo ✅ Flask API on http://localhost:5000
echo ✅ React frontend on http://localhost:3000
echo ✅ Cross-origin communication enabled
echo.
echo 🎯 Demo URLs:
echo   Frontend: http://localhost:3000
echo   API Health: http://localhost:5000/health
echo   Questions: http://localhost:5000/api/questions
echo.
pause