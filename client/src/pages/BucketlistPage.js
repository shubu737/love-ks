import React, { useState, useEffect } from 'react';
import { bucketAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const BucketlistPage = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'travel'
  });
  const [loading, setLoading] = useState(false);

  const BUCKET_CATEGORIES = [
    { value: 'travel', label: '✈️ Travel' },
    { value: 'goals', label: '🎯 Goals' },
    { value: 'experiences', label: '🎪 Experiences' },
    { value: 'dreams', label: '💭 Dreams' },
    { value: 'other', label: '📝 Other' }
  ];

  useEffect(() => {
    loadBucketItems();

    socketService.on('bucket-item-created', (item) => {
      setItems(prev => [item, ...prev]);
    });

    socketService.on('bucket-item-completed', (id) => {
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, completed: 1 } : item
      ));
    });

    socketService.on('bucket-item-deleted', (id) => {
      setItems(prev => prev.filter(item => item.id !== id));
    });

    return () => {
      socketService.off('bucket-item-created', null);
      socketService.off('bucket-item-completed', null);
      socketService.off('bucket-item-deleted', null);
    };
  }, []);

  const loadBucketItems = async () => {
    try {
      const response = await bucketAPI.getAll();
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error loading bucket items:', error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a bucket list item');
      return;
    }

    setLoading(true);
    try {
      await bucketAPI.create(formData);
      setFormData({ title: '', description: '', category: 'travel' });
      setShowForm(false);
    } catch (error) {
      alert('Error creating item');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteItem = async (id) => {
    try {
      await bucketAPI.complete(id);
    } catch (error) {
      alert('Error updating item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await bucketAPI.delete(id);
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎯 Bucket List</h1>
        <div className="bucket-stats">
          <p>{completedCount} of {totalCount} completed</p>
        </div>
        <button
          className="btn btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateItem}>
          <input
            type="text"
            placeholder="What's your goal?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            disabled={loading}
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={loading}
          >
            {BUCKET_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Goal'}
          </button>
        </form>
      )}

      <div className="bucket-items">
        <div className="bucket-section">
          <h3>🎯 Active Goals</h3>
          {items.filter(item => !item.completed).map(item => (
            <div key={item.id} className="bucket-item">
              <div className="item-content">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-small btn-success"
                  onClick={() => handleCompleteItem(item.id)}
                >
                  ✓ Complete
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.filter(item => item.completed).length > 0 && (
          <div className="bucket-section">
            <h3>✨ Completed</h3>
            {items.filter(item => item.completed).map(item => (
              <div key={item.id} className="bucket-item completed">
                <div className="item-content">
                  <h4 style={{ textDecoration: 'line-through' }}>{item.title}</h4>
                  <p className="completed-date">
                    Completed: {item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
