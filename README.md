# 💕 Love KS - Beautiful Couple's Memory App

Hello KISHU!! 💑 A gorgeous platform for couples to share photos, stories, letters, journals, and bucket list dreams together. Built with **React** frontend, **Node.js/Express** REST API backend, **WebSocket** real-time sync, and **SQLite** database.

## 🏗️ Architecture

- **Frontend**: React 18 with React Router for SPA navigation
- **Backend**: Node.js + Express REST API with Socket.io  
- **Database**: SQLite3 with 11 auto-initialized tables
- **Authentication**: JWT Token-based (stateless, 24h expiry)
- **Real-time**: WebSocket for instant sync across devices
- **Media**: Image compression (browser-image-compression), Multer file uploads
- **Styling**: Bootstrap 5 + Custom CSS (Romantic pink theme #ff6b9d)

## ✨ Features

- **📚 Albums** - Organize photos by category (Him 💙, Her 💗, Couple 💕)
- **🖼️ Gallery** - Upload & compress photos instantly
- **💕 Stories** - Record your love journey moments
- **💌 Letters** - Write contextual letters (When we fight, When you miss me, Private, Future, General)
- **📔 Journal** - Daily entries with plans, reflections & photos
- **🎯 Bucket List** - Dreams & goals to achieve together  
- **📝 Notes** - Organized with 5 categories
- **🔄 Real-time Sync** - WebSocket updates across devices instantly
- **🔐 Password Protected** - JWT authentication, private and secure
- **🎨 Romantic UI** - Beautiful pink theme with heart animations
- **📱 Responsive Design** - Works perfectly on mobile, tablet, desktop

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v16+ (download from nodejs.org)
- npm (comes with Node.js)
- Git (optional, for cloning)

### Installation

```bash
# 1. Navigate to project
cd "c:\Users\SHUBH\OneDrive\Documents\KIvi"

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..
```

### Running the Application

**Terminal 1 - Start Backend (Port 5000):**
```bash
npm start
# or with auto-reload:
npm run dev
```

**Terminal 2 - Start Frontend (Port 3000):**
```bash
cd client
npm start
```

**Access the Website:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000/api
- ✅ Health Check: http://localhost:5000/api/health

### First Time Setup

1. Open http://localhost:3000 in your browser
2. Click **"Sign up"** to register
3. Create username & password
4. Welcome to Love KS! 💕
5. Start by uploading photos to Gallery
6. Explore all 8 features in navigation

## 📂 Project Structure

```
Love KS/
├── app.js                     # Express backend server
├── package.json              # Backend dependencies
├── config/
│   └── database.js           # SQLite auto-initialization
├── routes/                   # API endpoints
│   ├── auth.js              # Register, login, verify
│   ├── gallery.js           # Photo CRUD
│   ├── stories.js           # Story CRUD
│   ├── notes.js             # Note CRUD
│   ├── albums.js            # Album CRUD
│   ├── letters.js           # Letter CRUD
│   ├── bucket.js            # Bucket list CRUD
│   └── journal.js           # Journal CRUD
├── middleware/
│   └── auth.js              # JWT verification
├── public/
│   ├── css/style.css
│   ├── js/script.js
│   └── uploads/             # Photo storage
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.js           # Main router & layout
│   │   ├── api.js           # Axios + JWT interceptor
│   │   ├── socket.js        # WebSocket connection
│   │   ├── imageUtils.js    # Image compression
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── components/
│   │   │   └── Layout.js    # Navigation (8 features)
│   │   └── pages/           # 8 pages
│   │       ├── HomePage.js
│   │       ├── AlbumsPage.js
│   │       ├── GalleryPage.js
│   │       ├── StoriesPage.js
│   │       ├── LettersPage.js
│   │       ├── JournalPage.js
│   │       ├── BucketlistPage.js
│   │       └── NotesPage.js
│   ├── public/index.html
│   └── package.json
│
├── mobile/                  # React Native app
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   ├── context/
│   │   └── services/
│   ├── app.json
│   └── package.json
│
└── database.db             # SQLite (auto-created on first run)
```

## 🎯 Features Explained

### 📚 Albums
- Create albums with categories: **Him 💙, Her 💗, Couple 💕, Other**
- Organize photos by theme
- View albums in beautiful grid layout
- Add/remove photos from albums
- Real-time sync across devices

### 🖼️ Gallery
- Upload multiple photos at once
- **Auto-compression** (max 1MB, 1920px) before upload
- Titles, descriptions, dates
- Beautiful grid with lazy loading
- Real-time photo sync
- Easy deletion with one click

### 💕 Stories
- Write detailed love stories & memories
- Date & story title tracking
- Edit and update reactions/
- Real-time updates across sessions
- Beautiful card presentation

### 💌 Letters
- Write contextual letters:
  - 💔 When we fight
  - 😢 When you miss me
  - 🤐 Private (read-only for you)
  - 📮 Future (scheduled/timed)
  - 💕 General love letters
- Recipient field
- Organized by type
- Real-time sync

### 📔 Journal  
- Daily entries with structure:
  - **Date**: When did this happen?
  - **Plan**: What we planned today
  - **Journal**: Thoughts & reflections
  - **Photos**: Upload up to 5 photos
- One entry per day
- Calendar date picker
- Real-time sync

### 🎯 Bucket List
- Create goals & dreams:
  - ✈️ Travel
  - 🎓 Goals
  - 🎢 Experiences
  - 💭 Dreams
- Track completion percentage
- Mark items as completed
- Timestamps for achievements
- Active/completed sections

### 📝 Notes
- Quick notes with categories:
  - 📌 General
  - 🎂 Anniversary
  - ⏰ Reminder
  - 💭 Dreams
  - 🎯 Bucket List
- Quick creation & deletion
- Organized grid view

### 🔄 Real-time Sync
- **WebSocket** connection keeps all devices in sync
- Open same album on 2 tabs = instant updates
- No page refreshes needed
- Event-driven architecture
- Edit somewhere, see it everywhere

## 🔌 API Endpoints Reference

### Authentication
```
POST   /api/auth/register      - New account
POST   /api/auth/login         - Login & get token
GET    /api/auth/me            - Current user info
```

### Gallery
```
GET    /api/gallery            - Get all photos
POST   /api/gallery/upload     - Upload new photo
DELETE /api/gallery/:id        - Delete photo
```

### Stories
```
GET    /api/stories            - Get all stories
POST   /api/stories/create     - Create story
PUT    /api/stories/:id        - Update story
DELETE /api/stories/:id        - Delete story
```

### Notes
```
GET    /api/notes              - Get all notes
POST   /api/notes/create       - Create note
DELETE /api/notes/:id          - Delete note
```

### Albums
```
GET    /api/albums             - Get all albums
POST   /api/albums/create      - Create album
GET    /api/albums/:id         - Get album details
POST   /api/albums/:id/photos  - Add photo to album
DELETE /api/albums/:id         - Delete album
```

### Letters
```
GET    /api/letters            - Get all letters
POST   /api/letters/create     - Create letter
GET    /api/letters/type/:type - Get by type
PUT    /api/letters/:id        - Update letter
DELETE /api/letters/:id        - Delete letter
```

### Bucket List
```
GET    /api/bucket             - Get all items
POST   /api/bucket/create      - Create item
PATCH  /api/bucket/:id/complete - Mark complete
DELETE /api/bucket/:id         - Delete item
```

### Journal
```
GET    /api/journal            - Get all entries
POST   /api/journal/create     - Create with photos
GET    /api/journal/:id        - Get entry details
PUT    /api/journal/:id        - Update entry  
DELETE /api/journal/:id        - Delete entry
```

## 🌐 Deploy to Production

### Quick Deploy to Render.com (FREE - Recommended)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Love KS production ready"
git push origin main
```

**Step 2: Build React**
```bash
cd client
npm run build
cd ..
```

**Step 3: Deploy to Render**
1. Go to https://render.com
2. Sign up (free account)
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `NODE_ENV=production`
     - `JWT_SECRET=your-random-key-here` (generate a strong key)

That's it! Render deploys automatically on every push to GitHub! 🚀

### Other Deployment Options

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- **Vercel + Render** (separate frontend/backend)
- **Heroku** (single server)
- **Railway** (easy to use)
- **Docker** deployment
- **Environment variables** configuration
- **Troubleshooting** guide

## 🛠️ Technologies & Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | SQLite3 | Data persistence |
| **Frontend** | React 18 | Single Page App |
| **Navigation** | React Router v6 | Page routing |
| **Real-time** | Socket.io | WebSocket events |
| **Auth** | JWT (jsonwebtoken) | Stateless authentication |
| **File Upload** | Multer | Photo upload handling |
| **Compression** | browser-image-compression | Client-side optimization |
| **Hashing** | bcryptjs | Password security |
| **UI** | Bootstrap 5 + Custom CSS | Responsive design |
| **HTTP** | Axios | API requests with interceptors |

## 💡 Tips for Best Experience

1. **Regular Backups** - Download your database periodically
2. **Photo Quality** - Camera photos auto-compress on upload
3. **Date Organization** - Use dates in photos/stories to organize memories
4. **Letters for Later** - Write letters to read at future dates
5. **Journal Consistency** - One entry per date keeps memories organized
6. **Mobile First** - Works perfectly on phones, tablets, desktop
7. **Share Device** - Open on same device for beautiful shared experience
8. **Real-time Magic** - Open 2 browser tabs to see instant sync

## 🎨 Customization Guide

### Change Brand Name
1. Update `client/src/components/Layout.js` - change "Love KS" text
2. Update `client/public/index.html` - change page title
3. Update `client/src/pages/HomePage.js` - change heading

### Change Color Scheme
Edit `client/src/styles/layout.css`:
```css
:root {
  --primary-pink: #ff6b9d;    /* Main color */
  --dark-pink: #d9298b;       /* Darker shade */
  --light-pink: #ffb3d9;      /* Lighter shade */
  --text-color: #333;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add New Feature
1. Create new route: `routes/newfeature.js`
2. Add to database: `config/database.js`
3. Create page: `client/src/pages/NewFeaturePage.js`
4. Add API calls: `client/src/api.js`
5. Update navigation: `client/src/components/Layout.js`
6. Import in router: `client/src/App.js`
7. Add WebSocket events: `routes/newfeature.js`
8. Listen in page: Use `useEffect` + socket listener

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill process or use different port
set PORT=5001
npm start
```

### Frontend won't start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm start
```

### WebSocket not connecting
- Verify backend is running on port 5000
- Check browser console (F12) for errors
- Ensure CLIENT_URL env includes `/` at end

### Photos not uploading
- Check `public/uploads` folder exists
- Verify browser console for errors
- Check backend logs for multer errors
- Max file size: 10MB per image

### Login not working
```bash
# Verify auth middleware
curl http://localhost:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Should return 200 with token
```

### Database corrupted
```bash
# Backup old database
mv database.db database.db.backup

# Restart app - new database auto-creates
npm start
```

### Port 3000 (Frontend) already in use
```bash
# Run frontend on different port
cd client
PORT=3001 npm start
```

## 🔐 Security Checklist

✅ **Before Deployment:**
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Use HTTPS in production (Render/Vercel handle this)
- [ ] Set secure environment variables
- [ ] Never commit `.env` file
- [ ] Update password hashing (bcryptjs v2.4.3+)
- [ ] CORS limited to production domain only
- [ ] File upload size limits enforced (10MB)
- [ ] JWT token expiry set (24 hours)
- [ ] SQL injection prevention (prepared statements)
- [ ] Rate limiting for auth endpoints (optional)

## 📱 Mobile App Setup

### React Native (Expo)

```bash
cd mobile
npm install

# Start Expo
npm start
# Scan QR with Expo Go app on phone

# Or run on Android
npm run android

# Or run on iOS
npm run ios
```

**Update API URL in mobile/src/services/api.js:**
```javascript
const API_URL = 'https://your-deployed-url.com/api';
```

## 📊 Database Schema Details

```sql
-- Users (authentication)
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos (gallery)
CREATE TABLE photos (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  filename TEXT NOT NULL,
  photo_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Stories
CREATE TABLE stories (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  story_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Notes
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Albums
CREATE TABLE albums (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Album Photos (associations)
CREATE TABLE album_photos (
  id INTEGER PRIMARY KEY,
  album_id INTEGER NOT NULL,
  photo_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(album_id) REFERENCES albums(id),
  FOREIGN KEY(photo_id) REFERENCES photos(id)
);

-- Letters
CREATE TABLE letters (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT,
  recipient TEXT,
  letter_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Bucket Items
CREATE TABLE bucket_items (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  completed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Journal Entries
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT,
  date DATE,
  plan TEXT,
  journal TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Journal Photos
CREATE TABLE journal_photos (
  id INTEGER PRIMARY KEY,
  journal_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(journal_id) REFERENCES journal_entries(id)
);
```

## 🚀 Performance Tips

- **Images**: Auto-compressed to 1MB max, 1920px dimensions
- **Database**: SQLite suitable for couples app (< 10,000 photos)
- **Real-time**: WebSocket scale up to ~100 concurrent users
- **Cache**: Browser caches API responses with axios interceptors
- **Lazy Loading**: Photos load on scroll (grid implementation)
- **Production**: Render/Vercel auto-scales based on traffic

## 📚 Documentation Links

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step deployment
- [API Routes](./routes/) - Detailed route documentation
- [Client README](./client/README.md) - Frontend specifics
- [Mobile README](./mobile/README.md) - React Native setup
- [Configuration](./config/database.js) - Database schema

## 🤝 Contribution Guidelines

Found a bug or have a feature request? 

1. Check existing issues
2. Create detailed bug report with steps to reproduce
3. Submit pull request with changes
4. Ensure tests pass and code follows style guide

## 📄 License

This project is open source and available under MIT License.

---

## 💕 Made with Love

Built with ❤️ for couples who want to preserve their beautiful memories together.

**Hello KISHU!! Let's create beautiful memories together! 📸💑**

**Quick Links:**
- 🌐 Deployed? Send URL to your partner!
- 📖 View [Deployment Guide](./DEPLOYMENT.md)
- 🐛 Report bugs in GitHub Issues  
- 🎨 Customize colors in Layout.js
- 📱 Mobile app access in `/mobile`

---

Last Updated: 2024 | Love KS v1.0
