const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await db.all(
      'SELECT * FROM stories ORDER BY story_date DESC, created_at DESC'
    );
    res.json({ success: true, stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading stories' });
  }
});

// Create story
router.post('/create', async (req, res) => {
  try {
    const { title, content, storyDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.run(
      'INSERT INTO stories (user_id, title, content, story_date) VALUES (?, ?, ?, ?)',
      [req.user?.id || 1, title, content, storyDate || new Date().toISOString()]
    );

    const story = {
      id: result.lastID,
      title,
      content,
      story_date: storyDate,
      created_at: new Date().toISOString()
    };

    // Emit real-time update
    req.io.emit('story-created', story);

    res.json({ success: true, message: 'Story created successfully', story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating story' });
  }
});

// Update story
router.put('/:id', async (req, res) => {
  try {
    const { title, content, storyDate } = req.body;

    await db.run(
      'UPDATE stories SET title = ?, content = ?, story_date = ? WHERE id = ?',
      [title, content, storyDate, req.params.id]
    );

    res.json({ success: true, message: 'Story updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating story' });
  }
});

// Delete story
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM stories WHERE id = ?', [req.params.id]);
    
    // Emit real-time update
    req.io.emit('story-deleted', { id: req.params.id });
    
    res.json({ success: true, message: 'Story deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting story' });
  }
});

module.exports = router;
