import React, { useState, useEffect } from 'react';
import { notesAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();

    // Subscribe to real-time updates
    socketService.on('note-created', (note) => {
      setNotes(prev => [note, ...prev]);
      console.log('New note added via WebSocket:', note);
    });

    socketService.on('note-deleted', (data) => {
      setNotes(prev => prev.filter(n => n.id !== data.id));
      console.log('Note deleted via WebSocket');
    });

    return () => {
      socketService.off('note-created', null);
      socketService.off('note-deleted', null);
    };
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await notesAPI.create(formData);
      
      if (response.data.note) {
        setNotes(prev => [response.data.note, ...prev]);
      }
      
      alert('Note saved!');
      setFormData({ title: '', content: '', category: 'general' });
    } catch (error) {
      alert('Error saving note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await notesAPI.delete(id);
        loadNotes();
      } catch (error) {
        alert('Error deleting note');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="col-lg-10 mx-auto">
        <h1 className="display-4 mb-2"><i className="fas fa-sticky-note" style={{ color: '#ff6b9d' }}></i> Secret Notes</h1>
        <p className="text-muted">Keep your sweet little secrets and reminders here</p>

        <div className="romantic-card p-4 mb-5">
          <h4 className="mb-3"><i className="fas fa-plus-circle"></i> Create New Note</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="noteTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control romantic-input"
                  id="noteTitle"
                  placeholder="Note title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="noteCategory" className="form-label">Category</label>
                <select
                  className="form-control romantic-input"
                  id="noteCategory"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="general">General</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="reminder">Reminder</option>
                  <option value="dreams">Dreams Together</option>
                  <option value="bucket-list">Bucket List</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="noteContent" className="form-label">Note</label>
              <textarea
                className="form-control romantic-input"
                id="noteContent"
                rows="4"
                placeholder="Write your note here..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn romantic-btn btn-lg w-100" disabled={submitting}>
              <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-save'}`}></i> {submitting ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        </div>

        {notes.length > 0 ? (
          <div className="row g-3">
            {notes.map(note => (
              <div key={note.id} className="col-md-6">
                <div className="card romantic-card h-100 note-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-1">{note.title}</h5>
                        <small className="badge romantic-badge">{note.category}</small>
                      </div>
                    </div>
                    <p className="card-text">{note.content.substring(0, 150)}...</p>
                    <small className="text-muted d-block mt-3">
                      <i className="fas fa-clock"></i> {new Date(note.created_at).toLocaleDateString()}
                    </small>
                    <div className="mt-3">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(note.id)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-5 romantic-card">
            <i className="fas fa-note-sticky" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p className="text-muted mt-3">No notes yet. Start by creating your first note!</p>
          </div>
        )}
      </div>
    </div>
  );
};
