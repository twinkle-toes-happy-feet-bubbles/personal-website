@echo off
echo Starting Blog Development Environment...
echo 1. Starting Python Server (http://localhost:8000)
start "Blog Server" npm run dev
echo 2. Starting Draft Watcher (Auto-compiles .md to .json)
start "Blog Watcher" npm run watch
echo.
echo Environment started! 
echo Open http://localhost:8000/blog.html to see your blog.
echo Write new posts in blog/drafts/*.md and save to update instantly.
pause
