@echo off

rem Navigate to the frontend directory
cd frontend

rem Run npm install in frontend
npm install

rem Run npm start in frontend (in a new command window)
start npm start

rem Navigate back to the outer directory
cd ..

rem Navigate to the backend directory
cd backend

rem Run python3 main.py in backend
python3 main.py

rem Navigate back to the outer directory (optional)
cd ..

