# 🛠️ Love KS - Developer Guide

Complete guide for developers to understand, extend, and contribute to Love KS.

## 📚 Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────┐
│  Frontend (React + Socket.io)       │
│  Port 3000 - Client-side app        │
└──────────────┬──────────────────────┘
               │ HTTP + WebSocket
┌──────────────▼──────────────────────┐
│  Backend (Express + Socket.io)      │
│  Port 5000 - REST API + WebSocket   │
└──────────────┬──────────────────────┘
               │ Queries
┌──────────────▼──────────────────────┐
│  Database (SQLite)                  │
│  File: database.db                  │
└─────────────────────────────────────┘
```

### Data Flow

**User Interaction:**
1. User clicks button in React component
2. API call made via Axios (with JWT header)
3. Express backend receives request
4. Database query executed
5. Response returned to frontend
6. WebSocket event emitted to all clients
7. Real-time update in all connected browsers

---

## 🗂️ Project Structure Deep Dive

### Routes (`routes/` folder)

Each route file exports Express router with endpoints:

**File: `routes/gallery.js`**
```javascript
// GET /api/gallery - Get all photos
router.get('/', authMiddleware, async (req, res) => {
  // req.user.id = authenticated user
  // Query photos from database
  // Emit WebSocket event: 'photo-uploaded'
});

// POST /api/gallery/upload - Upload photo
router.post('/upload', authMiddleware, upload.single('photo'), async (req, res) => {
  // req.file = uploaded file info
  // req.body = title, description, photo_date
  // Save file and DB record
  // Emit WebSocket event
});
```

**Pattern (All Routes Follow):**
1. Middleware: `authMiddleware` (validates JWT)
2. File handling: `upload.single('fieldname')` for photos
3. Database: `db.run()` or `db.get()` or `db.all()`
4. WebSocket: `socket.emit('event-name', data)`
5. Response: `res.json({ success: true, data })`

### Database (`config/database.js`)

**Pattern:**
```javascript
// Create table if not exists
db.run(`CREATE TABLE users (...)`);

// Query wrapper functions
async function getUser(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
```

**Available Methods:**
- `db.run(sql, params)` - INSERT/UPDATE/DELETE
- `db.get(sql, params)` - Get single row
- `db.all(sql, params)` - Get all rows
- All are async (wrapped in Promises)

### Frontend Architecture

**Components (`client/src/components/`)**
- `Layout.js` - Main navigation & header
- Features: Home page, each feature page
- React Router for page routing

**Context (`client/src/context/`)**
- `AuthContext.js` - Global auth state
- Provider wraps App
- Methods: `register()`, `login()`, `logout()`, `me()`

**Pages (`client/src/pages/`)**
```javascript
// Pattern:
function AlbumsPage() {
  const { user } = useAuth();  // Get current user
  const [albums, setAlbums] = useState([]);
  
  // Fetch data
  useEffect(() => {
    albumsAPI.getAll().then(setAlbums);
  }, []);
  
  // Listen to real-time updates
  useEffect(() => {
    socket.on('album-created', (data) => {
      setAlbums([...albums, data]);
    });
    return () => socket.off('album-created');
  }, [albums]);
  
  // Render UI
  return (<div>...</div>);
}
```

**API (`client/src/api.js`)**
```javascript
// Pattern:
export const albumsAPI = {
  getAll: async () => {
    return axios.get('/albums');  // Auto-adds /api and token
  },
  create: async (data) => {
    return axios.post('/albums/create', data);
  },
  // All requests auto-include: Authorization: Bearer token
};
```

**WebSocket (`client/src/socket.js`)**
```javascript
// Singleton pattern - only one connection
class Socket {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }
  
  connect(token) {
    this.socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
      reconnection: true
    });
  }
  
  on(event, callback) {
    this.socket.on(event, callback);
  }
  
  off(event, callback) {
    this.socket.off(event, callback);
  }
}
```

---

## 🔑 Key Patterns to Follow

### 1. Authentication Flow

**Backend:**
```javascript
// 1. User registers
POST /api/auth/register
  body: { username, password }
  -> hash password with bcryptjs
  -> save to DB
  -> return JWT token

// 2. User logs in
POST /api/auth/login
  body: { username, password }
  -> compare password with hash
  -> generate JWT token
  -> return token

// 3. Protected routes require middleware
router.get('/protected', authMiddleware, (req, res) => {
  // req.user.id is extracted from token
  // Safe to use for database queries
});
```

**Frontend:**
```javascript
// 1. Register
await authAPI.register({ username, password });
// Sets token in localStorage

// 2. Login
await authAPI.login({ username, password });
// Sets token in localStorage

// 3. All requests auto-include token
// Axios interceptor adds: Authorization: Bearer token

// 4. Logout
localStorage.removeItem('token');
```

### 2. CRUD Operations

**Create (POST):**
```javascript
// Backend
router.post('/create', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const id = await db.run(
    'INSERT INTO stories (user_id, title, content, created_at) VALUES (?, ?, ?, ?)',
    [req.user.id, title, content, new Date()]
  );
  socket.emit('story-created', { id, title, content, user_id: req.user.id });
  res.json({ success: true, story: { id, title, content } });
});

// Frontend
const story = await storiesAPI.create({ title, content });
setStories([...stories, story]);
// Or listen to WebSocket event instead
socket.on('story-created', (data) => {
  setStories([...stories, data]);
});
```

**Read (GET):**
```javascript
// Backend
router.get('/', authMiddleware, async (req, res) => {
  const stories = await db.all(
    'SELECT * FROM stories WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json({ success: true, stories });
});

// Frontend
useEffect(() => {
  storiesAPI.getAll().then(setStories);
}, []);
```

**Update (PUT):**
```javascript
// Backend
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  await db.run(
    'UPDATE stories SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, req.params.id, req.user.id]
  );
  socket.emit('story-updated', { id: req.params.id, title, content });
  res.json({ success: true });
});

// Frontend
await storiesAPI.update(id, { title, content });
// Update local state or listen to WebSocket
```

**Delete (DELETE):**
```javascript
// Backend
router.delete('/:id', authMiddleware, async (req, res) => {
  await db.run(
    'DELETE FROM stories WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  socket.emit('story-deleted', { id: req.params.id });
  res.json({ success: true });
});

// Frontend
await storiesAPI.delete(id);
setStories(stories.filter(s => s.id !== id));
```

### 3. WebSocket Real-time Updates

**Backend (emit to all clients):**
```javascript
// After creating resource
const io = req.app.get('io');  // Get Socket.io instance
io.emit('photo-uploaded', {
  id, title, description, filename, user_id
});

// Alternative: Emit to specific user
io.to(`user-${req.user.id}`).emit('photo-uploaded', data);
```

**Frontend (listen):**
```javascript
useEffect(() => {
  socket.on('photo-uploaded', (photo) => {
    setPhotos(prev => [photo, ...prev]);
  });
  
  return () => {
    socket.off('photo-uploaded');  // Cleanup
  };
}, []);
```

### 4. Form Handling

**Pattern:**
```javascript
const [formData, setFormData] = useState({ title: '', content: '' });
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const result = await storiesAPI.create(formData);
    setFormData({ title: '', content: '' });  // Clear form
    // Listen to WebSocket or update state
    setStories([...stories, result.story]);
  } catch (err) {
    setError(err.response?.data?.message || 'Error creating story');
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      value={formData.title}
      onChange={(e) => setFormData({...formData, title: e.target.value})}
      disabled={loading}
    />
    <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
    {error && <div className="error">{error}</div>}
  </form>
);
```

---

## 🎯 Adding a New Feature

### Example: Add "Memories" Feature

**Step 1: Create Database Table**

File: `config/database.js`
```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);
```

**Step 2: Create Backend Route**

File: `routes/memories.js`
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const db = require('../config/database');

// GET all memories
router.get('/', authMiddleware, async (req, res) => {
  const memories = await db.all(
    'SELECT * FROM memories WHERE user_id = ? ORDER BY date DESC',
    [req.user.id]
  );
  res.json({ success: true, memories });
});

// POST create memory
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, date } = req.body;
  const result = await db.run(
    'INSERT INTO memories (user_id, title, description, date, created_at) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, description, date, new Date()]
  );
  
  const io = req.app.get('io');
  io.emit('memory-created', { id: result.lastID, title, description, date });
  
  res.json({ success: true, memory: { id: result.lastID, title, description, date } });
});

// DELETE memory
router.delete('/:id', authMiddleware, async (req, res) => {
  await db.run(
    'DELETE FROM memories WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  
  const io = req.app.get('io');
  io.emit('memory-deleted', { id: req.params.id });
  
  res.json({ success: true });
});

module.exports = router;
```

**Step 3: Register Route in App**

File: `app.js`
```javascript
const memoriesRoutes = require('./routes/memories');
app.use('/api/memories', memoriesRoutes);
```

**Step 4: Create Frontend API**

File: `client/src/api.js`
```javascript
export const memoriesAPI = {
  getAll: () => axios.get('/memories'),
  create: (data) => axios.post('/memories/create', data),
  delete: (id) => axios.delete(`/memories/${id}`)
};
```

**Step 5: Create Frontend Page**

File: `client/src/pages/MemoriesPage.js`
```javascript
import { useState, useEffect } from 'react';
import { memoriesAPI } from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';

export default function MemoriesPage() {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });
  const [loading, setLoading] = useState(false);

  // Fetch memories
  useEffect(() => {
    memoriesAPI.getAll().then(setMemories);
  }, []);

  // Listen to real-time updates
  useEffect(() => {
    socket.on('memory-created', (memory) => {
      setMemories([memory, ...memories]);
    });
    
    socket.on('memory-deleted', ({ id }) => {
      setMemories(memories.filter(m => m.id !== id));
    });

    return () => {
      socket.off('memory-created');
      socket.off('memory-deleted');
    };
  }, [memories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await memoriesAPI.create(formData);
      setFormData({ title: '', description: '', date: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="memories-page">
      <h1>📚 Memories</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
        <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      </form>

      <div className="memories-grid">
        {memories.map(memory => (
          <div key={memory.id} className="memory-card">
            <h3>{memory.title}</h3>
            <p>{memory.description}</p>
            <small>{memory.date}</small>
            <button onClick={() => memoriesAPI.delete(memory.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 6: Add to Navigation**

File: `client/src/components/Layout.js`
```javascript
<nav className="navbar">
  <Link to="/">Home</Link>
  <Link to="/memories">📚 Memories</Link>
  {/* ... other links ... */}
</nav>
```

**Step 7: Add Route to App**

File: `client/src/App.js`
```javascript
import MemoriesPage from './pages/MemoriesPage';

<Route path="/memories" element={<MemoriesPage />} />
```

**Step 8: Deploy!**

```bash
npm start  # Backend
cd client && npm start  # Frontend
```

---

## 🧪 Testing Patterns

### Manual Testing

**Test New Endpoint:**
```bash
# In terminal or Postman
curl -X POST http://localhost:5000/api/memories/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Memory","description":"Details","date":"2024-01-01"}'
```

**Test Real-time Sync:**
1. Create entry in Tab 1
2. Check Tab 2 auto-updates
3. No page refresh needed

### Browser Debugging

**F12 DevTools:**
1. **Console** - Check for errors
2. **Network** - Check API responses
3. **Application** - Check localStorage (token)
4. **Sources** - Set breakpoints in JS

### Server Debugging

**Terminal Logs:**
```bash
# Enable debug mode
set DEBUG=*
npm start  # See all logs
```

---

## 📊 Database Queries Reference

### Common Patterns

**Get User's Data:**
```javascript
const data = await db.all(
  'SELECT * FROM photos WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
  [userId]
);
```

**Count Entries:**
```javascript
const count = await db.get(
  'SELECT COUNT(*) as count FROM stories WHERE user_id = ?',
  [userId]
);
```

**Join Tables:**
```javascript
const albums = await db.all(`
  SELECT a.*, COUNT(ap.id) as photo_count
  FROM albums a
  LEFT JOIN album_photos ap ON a.id = ap.album_id
  WHERE a.user_id = ?
  GROUP BY a.id
`, [userId]);
```

**Update with Timestamp:**
```javascript
await db.run(
  'UPDATE bucket_items SET completed = 1, completed_at = ? WHERE id = ? AND user_id = ?',
  [new Date(), itemId, userId]
);
```

---

## 🚀 Performance Optimization

### Frontend
- Use React.memo() for expensive components
- Usdt useCallback() for event handlers
- Lazy load images
- Code splitting with React.lazy()

### Backend
- Index database columns: `CREATE INDEX idx_user_id ON photos(user_id)`
- Paginate large queries: `LIMIT 50 OFFSET 0`
- Cache frequent queries (coming soon)
- Compress images client-side before upload

### Database
- Use transactions for multi-step operations
- Clean up old sessions periodically
- Backup regularly

---

## 📚 Resources

- [Express.js Docs](http://expressjs.com/)
- [React Docs](https://react.dev/)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Socket.io Docs](http://socket.io/)
- [JWT Concepts](https://jwt.io/introduction)

---

## 🤝 Contributing

### Code Style
- Use consistent indentation (2 spaces)
- Name variables clearly
- Comment complex logic
- Follow existing patterns

### Before Submitting
- Test locally
- Check for console errors
- Verify real-time sync works
- Test on mobile if UI changed
- Update documentation

### Commit Messages
```
feature: Add new feature name
  
- Describe what you added
- Explain why it's useful
- List any breaking changes
```

---

Made with 💕 for Love KS developers
