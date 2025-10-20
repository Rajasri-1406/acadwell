@echo off
set timestamp=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set timestamp=%timestamp: =0%
set backupdir=backups\%timestamp%

echo 💾 Creating backup: %timestamp%

mkdir "%backupdir%"

echo 🗄️ Backing up MongoDB...
mongodump --db acadwell --out "%backupdir%\mongo"

echo 📁 Backing up code...
xcopy "frontend\src" "%backupdir%\frontend-src\" /E /I /Q
xcopy "backend\app" "%backupdir%\backend-app\" /E /I /Q

echo 📋 Saving package info...
cd frontend && npm list > "..\%backupdir%\frontend-packages.txt" 2>nul
cd ..\backend && pip freeze > "..\%backupdir%\backend-packages.txt"
cd ..

echo ✅ Backup completed: %backupdir%
pause