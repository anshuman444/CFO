@echo off
echo [SYSTEM] Starting LumenXo CFO Premium Dashboard...

:: Start Backend API
start "LumenXo Backend API" cmd /k "python -m uvicorn api_server:app --host 0.0.0.0 --port 8000"

:: Start Frontend
cd frontend
start "LumenXo Frontend" cmd /k "npm run dev"

echo [SUCCESS] Both services are initializing.
echo [INFO] API: http://localhost:8000
echo [INFO] Dashboard: http://localhost:3000
pause
