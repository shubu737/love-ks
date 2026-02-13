const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all bucket list items
router.get('/', async (req, res) => {
  try {
    const items = await db.all(
      'SELECT * FROM bucket_items ORDER BY completed ASC, created_at DESC'
    );
    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading bucket list' });
  }
});

// Create bucket list item
router.post('/create', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.run(
      'INSERT INTO bucket_items (user_id, title, description, category) VALUES (?, ?, ?, ?)',
      [req.user?.id || 1, title, description || '', category || 'general']
    );

    const item = {
      id: result.lastID,
      title,
      description,
      category,
      completed: 0,
      created_at: new Date().toISOString()
    };

    req.io.emit('bucket-item-created', item);

    res.json({ success: true, message: 'Bucket item created successfully', item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating bucket item' });
  }
});

// Mark item as complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const now = new Date().toISOString();
    await db.run(
      'UPDATE bucket_items SET completed = 1, completed_at = ? WHERE id = ?',
      [now, req.params.id]
    );

    req.io.emit('bucket-item-completed', req.params.id);

    res.json({ success: true, message: 'Item marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete bucket item
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM bucket_items WHERE id = ?', [req.params.id]);

    req.io.emit('bucket-item-deleted', req.params.id);

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
