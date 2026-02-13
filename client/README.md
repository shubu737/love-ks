# Love KS - React Frontend

Beautiful, responsive React frontend for the Love KS couple's memory app.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
src/
├── App.js                    # Main router & layout setup
├── index.js                  # React entry point
├── api.js                    # Axios instance + all API calls
├── socket.js                 # WebSocket connection manager
├── imageUtils.js             # Image compression utilities
├── components/
│   └── Layout.js             # Navigation bar (8 features)
├── context/
│   └── AuthContext.js        # Global auth state
├── pages/                    # 8 main feature pages
│   ├── HomePage.js
│   ├── AlbumsPage.js
│   ├── GalleryPage.js
│   ├── StoriesPage.js
│   ├── LettersPage.js
│   ├── JournalPage.js
│   ├── BucketlistPage.js
│   └── NotesPage.js
├── styles/                   # CSS files
│   ├── layout.css
│   ├── pages.css
│   └── auth.css
└── public/
    ├── index.html
    └── favicon.ico
```

## 🔑 Key Features

### Authentication
- Register new account
- Login with credentials
- JWT token-based (auto sent in headers)
- Token stored in localStorage
- Auto-logout on token expiry

### Real-time Sync
- WebSocket listeners on all pages
- Instant updates across browser tabs
- Event-driven architecture
- Auto-reconnect on disconnect

### Image Compression
- Client-side compression before upload
- Max 1MB file size
- Max 1920px dimensions
- Reduces bandwidth by 80%+

### Responsive Design
- Works on mobile, tablet, desktop
- Bootstrap 5 framework
- Custom pink theme (#ff6b9d)
- Touch-friendly buttons

## 🎯 Pages Overview

### HomePage
- Dashboard with stats
- 8 feature cards
- Quick navigation
- Welcome greeting

### AlbumsPage
- Create albums by category
- Add photos to albums
- View album grid
- Categories: Him/Her/Couple/Other

### GalleryPage
- Upload photos with titles
- Auto-compression on upload
- Image grid with details
- Delete functionality
- Real-time sync

### StoriesPage
- Write love stories
- Add dates & titles
- Edit/delete stories
- Beautiful card layout
- Real-time updates

### LettersPage
- Write letters by type
- Types: When we fight, When you miss me, Private, Future, General
- Add recipient name
- Letter dates
- List view

### JournalPage
- Daily journal entries
- Date picker (one per day)
- Plan field (what to do today)
- Journal field (thoughts/reflections)
- Upload up to 5 photos per entry
- Real-time sync

### BucketlistPage
- Create goals & dreams
- Categories: Travel, Goals, Experiences, Dreams
- Mark as completed
- Completion percentage
- Active vs completed sections

### NotesPage
- Quick notes
- 5 categories: General, Anniversary, Reminder, Dreams, Bucket List
- Create/delete easily
- Grid layout
- Category filtering

## 🔌 WebSocket Events Handled

```javascript
// Gallery events
socket.on('photo-uploaded', data => { /* realtime update */ });
socket.on('photo-deleted', data => { /* remove photo */ });

// Story events
socket.on('story-created', data => { /* add story */ });
socket.on('story-deleted', data => { /* remove story */ });

// Note events
socket.on('note-created', data => { /* add note */ });
socket.on('note-deleted', data => { /* remove note */ });

// Album events
socket.on('album-created', data => { /* add album */ });
socket.on('album-deleted', data => { /* remove album */ });
socket.on('album-photo-added', data => { /* update album */ });

// Letter events
socket.on('letter-created', data => { /* add letter */ });
socket.on('letter-deleted', data => { /* remove letter */ });
socket.on('letter-updated', data => { /* update letter */ });

// Bucket events
socket.on('bucket-item-created', data => { /* add item */ });
socket.on('bucket-item-completed', data => { /* mark complete */ });
socket.on('bucket-item-deleted', data => { /* remove item */ });

// Journal events
socket.on('journal-entry-created', data => { /* add entry */ });
socket.on('journal-entry-deleted', data => { /* remove entry */ });
socket.on('journal-entry-updated', data => { /* update entry */ });
```

## 🏗️ Architecture Patterns

### API Calls with JWT
```javascript
import { galleryAPI } from './api';

// All API calls auto-include JWT token
const photos = await galleryAPI.getAll();
await galleryAPI.upload(formData);
```

### WebSocket Connection
```javascript
import { socket } from './socket';

useEffect(() => {
  socket.on('photo-uploaded', handlePhotoUpload);
  return () => socket.off('photo-uploaded', handlePhotoUpload);
}, []);
```

### Context for Auth
```javascript
import { useAuth } from './context/AuthContext';

const { user, token, login, logout } = useAuth();
```

## 🎨 Styling

### Color Scheme
```css
--primary-pink: #ff6b9d;
--dark-pink: #d9298b;
--light-pink: #ffb3d9;
```

### Responsive Breakpoints
```css
Mobile: < 576px
Tablet: 576px - 768px
Desktop: > 768px
```

## 🔒 Security

- JWT tokens (24h expiry)
- Secure localStorage (no XSS)
- CORS protection
- Password hashing on backend
- Environment variables for API URL

## 🚀 Deployment

```bash
# Build optimized production bundle
npm run build

# Output: build/ folder (optimized JS/CSS/HTML)
# Upload to Render/Vercel/etc.
```

## 🐛 Debugging

### Check Network Requests
Open Chrome DevTools → Network tab
- Look for 401 Unauthorized (token issue)
- Check API response status codes
- Verify request headers include Authorization

### Check WebSocket Connection
Console:
```javascript
socket.connected  // true if connected
socket.io.engine.transport.name  // websocket or polling
```

### Check Authentication
```javascript
const token = localStorage.getItem('token');
console.log(token); // Should exist and not be 'null'
```

## 📦 Building for Production

```bash
# Build optimized bundle
npm run build

# This creates:
# - build/index.html (minified)
# - build/js/ (optimized JS chunks)
# - build/css/ (optimized CSS)
# - build/static/ (assets)
```

## 🔧 Environment Variables

Create `.env` file in `client/`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

For production (set in Render/Vercel dashboard):
```
REACT_APP_API_URL=https://your-deployed-url.com/api
REACT_APP_SOCKET_URL=https://your-deployed-url.com
```

## 📚 Dependencies

- **react**: UI library
- **react-router-dom**: Page routing
- **axios**: HTTP client
- **socket.io-client**: WebSocket client
- **bootstrap**: CSS framework
- **browser-image-compression**: Image optimization
- **date-fns**: Date utilities (optional)

## 💡 Best Practices

1. **Use Custom Hooks**: Extract API logic to hooks
2. **Memoize Components**: Prevent unnecessary re-renders
3. **Handle Errors**: Show user-friendly error messages
4. **Loading States**: Display loading spinners while fetching
5. **Empty States**: Show friendly messages when no data
6. **Keyboard Support**: Ensure forms are keyboard accessible
7. **Mobile Testing**: Test on actual mobile devices
8. **Performance**: Use React DevTools Profiler

## 🔗 Connected Services

- **Backend API**: http://localhost:5000 (local) or production URL
- **WebSocket**: Same as backend
- **Database**: SQLite (backend only)
- **File Storage**: public/uploads folder

## 📞 Support

- Check [main README](../README.md) for general help
- Check [Deployment Guide](../DEPLOYMENT.md) for production
- Review backend [routes](../routes/) for API details
- Check console.log messages for debugging

---

Made with 💕 for Love KS
