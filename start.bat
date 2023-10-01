@echo off

rem Navigate to the frontend directory
cd frontend

rem Run npm install in frontend
call npm install

rem Run npm start in frontend (in a new command window)
start /b npm start

rem Navigate back to the outer directory
cd ..

rem Navigate to the backend directory
cd backend

rem Run python3 main.py in backend
py main.py

rem Navigate back to the outer directory (optional)
cd ..

