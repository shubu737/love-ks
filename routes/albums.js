const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all albums
router.get('/', async (req, res) => {
  try {
    const albums = await db.all(
      'SELECT * FROM albums ORDER BY created_at DESC'
    );
    res.json({ success: true, albums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading albums' });
  }
});

// Create album
router.post('/create', async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Album name is required' });
    }

    const result = await db.run(
      'INSERT INTO albums (user_id, name, description, category) VALUES (?, ?, ?, ?)',
      [req.user?.id || 1, name, description || '', category || 'other']
    );

    const album = {
      id: result.lastID,
      name,
      description,
      category,
      created_at: new Date().toISOString()
    };

    req.io.emit('album-created', album);

    res.json({ success: true, message: 'Album created successfully', album });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating album' });
  }
});

// Get album with photos
router.get('/:id', async (req, res) => {
  try {
    const album = await db.get(
      'SELECT * FROM albums WHERE id = ?',
      [req.params.id]
    );

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const photos = await db.all(`
      SELECT p.* FROM photos p
      JOIN album_photos ap ON p.id = ap.photo_id
      WHERE ap.album_id = ?
      ORDER BY ap.added_at DESC
    `, [req.params.id]);

    res.json({ success: true, album, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading album' });
  }
});

// Add photo to album
router.post('/:id/photos', async (req, res) => {
  try {
    const { photo_id } = req.body;

    if (!photo_id) {
      return res.status(400).json({ error: 'Photo ID required' });
    }

    await db.run(
      'INSERT INTO album_photos (album_id, photo_id) VALUES (?, ?)',
      [req.params.id, photo_id]
    );

    req.io.emit('album-photo-added', { album_id: req.params.id, photo_id });

    res.json({ success: true, message: 'Photo added to album' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding photo' });
  }
});

// Delete album
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM album_photos WHERE album_id = ?', [req.params.id]);
    await db.run('DELETE FROM albums WHERE id = ?', [req.params.id]);

    req.io.emit('album-deleted', req.params.id);

    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting album' });
  }
});

module.exports = router;
