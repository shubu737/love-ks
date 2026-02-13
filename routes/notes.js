const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await db.all(
      'SELECT * FROM notes ORDER BY created_at DESC'
    );
    res.json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading notes' });
  }
});

// Create note
router.post('/create', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.run(
      'INSERT INTO notes (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [req.user?.id || 1, title, content, category || 'general']
    );

    const note = {
      id: result.lastID,
      title,
      content,
      category: category || 'general',
      created_at: new Date().toISOString()
    };

    // Emit real-time update
    req.io.emit('note-created', note);

    res.json({ success: true, message: 'Note created successfully', note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category } = req.body;

    await db.run(
      'UPDATE notes SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, category, req.params.id]
    );

    res.json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM notes WHERE id = ?', [req.params.id]);
    
    // Emit real-time update
    req.io.emit('note-deleted', { id: req.params.id });
    
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting note' });
  }
});

module.exports = router;
