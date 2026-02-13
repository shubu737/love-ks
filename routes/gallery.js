const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all photos
router.get('/', async (req, res) => {
  try {
    const photos = await db.all(
      'SELECT * FROM photos ORDER BY photo_date DESC, created_at DESC'
    );
    res.json({ success: true, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading gallery' });
  }
});

// Upload photo
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { title, description, photoDate } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await db.run(
      'INSERT INTO photos (user_id, title, description, filename, photo_date) VALUES (?, ?, ?, ?, ?)',
      [req.user?.id || 1, title || 'Untitled', description || '', req.file.filename, photoDate || new Date().toISOString()]
    );

    const photo = {
      id: result.lastID,
      title,
      description,
      filename: req.file.filename,
      photo_date: photoDate,
      created_at: new Date().toISOString()
    };

    // Emit real-time update
    req.io.emit('photo-uploaded', photo);

    res.json({ success: true, message: 'Photo uploaded successfully', photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading photo' });
  }
});

// Delete photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await db.get('SELECT * FROM photos WHERE id = ?', [req.params.id]);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    await db.run('DELETE FROM photos WHERE id = ?', [req.params.id]);
    
    // Emit real-time update
    req.io.emit('photo-deleted', { id: req.params.id });
    
    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting photo' });
  }
});

module.exports = router;
