const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// Configure multer for journal photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'journal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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

// Get all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await db.all(
      'SELECT * FROM journal_entries ORDER BY date DESC, created_at DESC'
    );
    res.json({ success: true, entries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading journal entries' });
  }
});

// Create journal entry
router.post('/create', upload.array('photos', 5), async (req, res) => {
  try {
    const { title, date, plan, journal } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.run(
      'INSERT INTO journal_entries (user_id, title, date, plan, journal) VALUES (?, ?, ?, ?, ?)',
      [req.user?.id || 1, title, date || new Date().toISOString().split('T')[0], plan || '', journal || '']
    );

    // Add photos if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await db.run(
          'INSERT INTO journal_photos (journal_id, filename) VALUES (?, ?)',
          [result.lastID, file.filename]
        );
      }
    }

    const entry = {
      id: result.lastID,
      title,
      date,
      plan,
      journal,
      photos: req.files ? req.files.map(f => f.filename) : [],
      created_at: new Date().toISOString()
    };

    req.io.emit('journal-entry-created', entry);

    res.json({ success: true, message: 'Journal entry created successfully', entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating journal entry' });
  }
});

// Get journal entry with photos
router.get('/:id', async (req, res) => {
  try {
    const entry = await db.get(
      'SELECT * FROM journal_entries WHERE id = ?',
      [req.params.id]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const photos = await db.all(
      'SELECT * FROM journal_photos WHERE journal_id = ?',
      [req.params.id]
    );

    res.json({ success: true, entry, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading entry' });
  }
});

// Update journal entry
router.put('/:id', async (req, res) => {
  try {
    const { title, date, plan, journal } = req.body;

    await db.run(
      'UPDATE journal_entries SET title = ?, date = ?, plan = ?, journal = ? WHERE id = ?',
      [title, date, plan, journal, req.params.id]
    );

    req.io.emit('journal-entry-updated', req.params.id);

    res.json({ success: true, message: 'Entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// Delete journal entry
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM journal_photos WHERE journal_id = ?', [req.params.id]);
    await db.run('DELETE FROM journal_entries WHERE id = ?', [req.params.id]);

    req.io.emit('journal-entry-deleted', req.params.id);

    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

module.exports = router;
