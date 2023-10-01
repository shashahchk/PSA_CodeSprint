#!/bin/bash

# Navigate to the frontend directory
cd ./frontend

# Run npm install in frontend
npm install

# Run npm start in frontend (in the background)
npm start &

# Navigate back to the outer directory
cd ..

# Navigate to the backend directory
cd ./backend

# Install python dependencies
python3 -m pip install -r requirements.txt

# Run python3 main.py in backend
python3 main.py

# Navigate back to the outer directory (optional)
cd ..

