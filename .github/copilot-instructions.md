# Couple Memories Website - Development Instructions

This is a romantic personal website for couples to share photos, stories, and notes.

## Project Overview
- **Type**: Node.js + Express Web Application
- **Database**: SQLite3
- **Frontend**: EJS Templates with Bootstrap 5
- **Theme**: Love/Romance themed with pink color scheme

## Key Files & Folders
- `app.js` - Main server application
- `config/database.js` - SQLite database setup
- `routes/` - API routes (auth, gallery, stories, notes)
- `views/` - EJS templates for pages
- `public/` - Static files (CSS, JS, uploads)

## Getting Started
1. Run `npm install` to install dependencies
2. Run `npm start` to launch server
3. Visit http://localhost:3000
4. Register a new account with couple names
5. Start sharing memories!

## Available Scripts
- `npm start` - Run the server
- `npm run dev` - Run with nodemon (auto-reload)

## Environment Variables (.env)
- PORT=3000
- NODE_ENV=development
- SESSION_SECRET=couple-memories-secret-key

## Database Tables
- users (username, password, name)
- photos (title, description, filename, photo_date)
- stories (title, content, story_date)
- notes (title, content, category)

## Features
✅ User authentication with password hashing
✅ Photo gallery with upload
✅ Love stories section
✅ Secret notes with categories
✅ Romantic UI with animations
✅ Mobile responsive
✅ Session-based protection

## Common Development Tasks
- Add new route: Create file in `/routes/` and require in `app.js`
- Modify styling: Edit `/public/css/style.css`
- Add features: Update database in `config/database.js` and create routes
- Create new page: Add EJS template in `/views/`

## Deployment
- Ensure PORT environment variable is set
- Upload to hosting (Heroku, Render, etc.)
- Use environment variables for secrets
- Database will auto-initialize on first run

---
Made with 💕 for love
