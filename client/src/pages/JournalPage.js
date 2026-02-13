import React, { useState, useEffect } from 'react';
import { journalAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Hello KISHU!!',
    date: new Date().toISOString().split('T')[0],
    plan: '',
    journal: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntries();

    socketService.on('journal-entry-created', (entry) => {
      setEntries(prev => [entry, ...prev]);
    });

    socketService.on('journal-entry-deleted', (id) => {
      setEntries(prev => prev.filter(e => e.id !== id));
    });

    return () => {
      socketService.off('journal-entry-created', null);
      socketService.off('journal-entry-deleted', null);
    };
  }, []);

  const loadEntries = async () => {
    try {
      const response = await journalAPI.getAll();
      setEntries(response.data.entries || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('date', formData.date);
      form.append('plan', formData.plan);
      form.append('journal', formData.journal);

      formData.photos.forEach((photo, index) => {
        form.append('photos', photo);
      });

      await journalAPI.create(form);
      setFormData({
        title: 'Hello KISHU!!',
        date: new Date().toISOString().split('T')[0],
        plan: '',
        journal: '',
        photos: []
      });
      setShowForm(false);
    } catch (error) {
      alert('Error creating entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Delete this journal entry?')) {
      try {
        await journalAPI.delete(id);
      } catch (error) {
        alert('Error deleting entry');
      }
    }
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📔 Journal</h1>
        <button
          className="btn btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateEntry}>
          <input
            type="text"
            placeholder="Journal entry title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={loading}
          />
          <textarea
            placeholder="Plan for today"
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            rows="3"
            disabled={loading}
          />
          <textarea
            placeholder="Journal entry"
            value={formData.journal}
            onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
            rows="6"
            disabled={loading}
          />
          <div className="photo-upload">
            <label>Add photos:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoSelect}
              disabled={loading}
            />
            {formData.photos.length > 0 && (
              <p>{formData.photos.length} photo(s) selected</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      )}

      <div className="journal-entries">
        {entries.length === 0 ? (
          <p className="empty-message">No journal entries yet. Start journaling your love story!</p>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="journal-entry-card"
              onClick={() => setSelectedEntry(entry)}
            >
              <h3>{entry.title}</h3>
              <p className="entry-date">{new Date(entry.date).toLocaleDateString()}</p>
              {entry.plan && <p className="entry-plan"><strong>Plan:</strong> {entry.plan}</p>}
              <p className="entry-text">{entry.journal.substring(0, 150)}...</p>
              <button
                className="btn btn-small btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEntry(entry.id);
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {selectedEntry && (
        <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEntry.title}</h2>
            <p className="entry-date">{new Date(selectedEntry.date).toLocaleDateString()}</p>
            {selectedEntry.plan && (
              <div>
                <h4>Plan:</h4>
                <p>{selectedEntry.plan}</p>
              </div>
            )}
            <div>
              <h4>Journal:</h4>
              <p>{selectedEntry.journal}</p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
