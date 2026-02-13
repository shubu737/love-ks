const express = require('express');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const storiesRoutes = require('./routes/stories');
const notesRoutes = require('./routes/notes');
const albumsRoutes = require('./routes/albums');
const lettersRoutes = require('./routes/letters');
const bucketRoutes = require('./routes/bucket');
const journalRoutes = require('./routes/journal');
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'couple-memories-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize database
db.initialize();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gallery', authMiddleware, galleryRoutes);
app.use('/api/stories', authMiddleware, storiesRoutes);
app.use('/api/notes', authMiddleware, notesRoutes);
app.use('/api/albums', authMiddleware, albumsRoutes);
app.use('/api/letters', authMiddleware, lettersRoutes);
app.use('/api/bucket', authMiddleware, bucketRoutes);
app.use('/api/journal', authMiddleware, journalRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`\n💕 API Server running on http://localhost:${PORT}`);
  console.log('🎵 React frontend on http://localhost:3000');
  console.log('🔌 WebSocket connection available\n');
});

module.exports = app;
