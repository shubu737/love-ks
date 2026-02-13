const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all letters
router.get('/', async (req, res) => {
  try {
    const letters = await db.all(
      'SELECT * FROM letters ORDER BY letter_date DESC, created_at DESC'
    );
    res.json({ success: true, letters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading letters' });
  }
});

// Create letter
router.post('/create', async (req, res) => {
  try {
    const { title, content, type, recipient, letterDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.run(
      'INSERT INTO letters (user_id, title, content, type, recipient, letter_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user?.id || 1, title, content, type || 'general', recipient || '', letterDate || new Date().toISOString()]
    );

    const letter = {
      id: result.lastID,
      title,
      content,
      type,
      recipient,
      letter_date: letterDate,
      created_at: new Date().toISOString()
    };

    req.io.emit('letter-created', letter);

    res.json({ success: true, message: 'Letter created successfully', letter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating letter' });
  }
});

// Get letter by type
router.get('/type/:type', async (req, res) => {
  try {
    const letters = await db.all(
      'SELECT * FROM letters WHERE type = ? ORDER BY letter_date DESC',
      [req.params.type]
    );
    res.json({ success: true, letters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading letters' });
  }
});

// Update letter
router.put('/:id', async (req, res) => {
  try {
    const { title, content, type, recipient, letterDate } = req.body;

    await db.run(
      'UPDATE letters SET title = ?, content = ?, type = ?, recipient = ?, letter_date = ? WHERE id = ?',
      [title, content, type, recipient, letterDate, req.params.id]
    );

    req.io.emit('letter-updated', { id: req.params.id });

    res.json({ success: true, message: 'Letter updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating letter' });
  }
});

// Delete letter
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM letters WHERE id = ?', [req.params.id]);

    req.io.emit('letter-deleted', req.params.id);

    res.json({ success: true, message: 'Letter deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting letter' });
  }
});

module.exports = router;
