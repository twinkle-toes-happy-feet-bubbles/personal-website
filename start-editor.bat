@echo off
echo Starting Blog Editor Environment...
echo 1. Starting Blog Server (http://localhost:8000)
start "Blog Server" npm run dev
echo 2. Starting Editor UI (http://localhost:3000)
start "Blog Editor" npm run editor
echo.
echo Environment started! 
echo Go to http://localhost:3000 to write your posts.
echo Go to http://localhost:8000/blog.html to view your blog.
pause
