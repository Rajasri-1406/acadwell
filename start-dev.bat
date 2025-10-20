@echo off
echo 🚀 Starting AcadWell Development Environment...

echo.
echo 📊 Starting MongoDB...
net start MongoDB
timeout /t 3

echo.
echo 🐍 Starting Flask Backend (Port 5000)...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"
timeout /t 5

echo.
echo ⚛️ Starting React Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5

echo.
echo ✅ All services started!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 🗄️ MongoDB: mongodb://localhost:27017

pause