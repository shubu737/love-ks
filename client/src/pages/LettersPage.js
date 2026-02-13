import React, { useState, useEffect } from 'react';
import { lettersAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const LettersPage = () => {
  const [letters, setLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    recipient: ''
  });
  const [loading, setLoading] = useState(false);

  const LETTER_TYPES = [
    { value: 'when-we-fight', label: '😔 When We Fight' },
    { value: 'when-you-miss-me', label: '💭 When You Miss Me' },
    { value: 'private', label: '🔐 Private' },
    { value: 'future', label: '🎯 Future' },
    { value: 'general', label: '💌 General' }
  ];

  useEffect(() => {
    loadLetters();

    socketService.on('letter-created', (letter) => {
      setLetters(prev => [letter, ...prev]);
    });

    socketService.on('letter-deleted', (id) => {
      setLetters(prev => prev.filter(l => l.id !== id));
    });

    return () => {
      socketService.off('letter-created', null);
      socketService.off('letter-deleted', null);
    };
  }, []);

  const loadLetters = async () => {
    try {
      const response = await lettersAPI.getAll();
      setLetters(response.data.letters || []);
    } catch (error) {
      console.error('Error loading letters:', error);
    }
  };

  const handleCreateLetter = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await lettersAPI.create({
        ...formData,
        letterDate: new Date().toISOString()
      });
      setFormData({ title: '', content: '', type: 'general', recipient: '' });
      setShowForm(false);
    } catch (error) {
      alert('Error creating letter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLetter = async (id) => {
    if (window.confirm('Delete this letter?')) {
      try {
        await lettersAPI.delete(id);
      } catch (error) {
        alert('Error deleting letter');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💌 Letters</h1>
        <button
          className="btn btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write Letter'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateLetter}>
          <input
            type="text"
            placeholder="Letter title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            disabled={loading}
          >
            {LETTER_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Recipient (optional)"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            disabled={loading}
          />
          <textarea
            placeholder="Write your letter..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="6"
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Letter'}
          </button>
        </form>
      )}

      <div className="letters-list">
        {letters.length === 0 ? (
          <p className="empty-message">No letters yet. Write one to remember special moments!</p>
        ) : (
          letters.map(letter => (
            <div key={letter.id} className="letter-card">
              <div className="letter-header">
                <h3>{letter.title}</h3>
                <span className="letter-type">{letter.type}</span>
              </div>
              {letter.recipient && <p className="letter-recipient">To: {letter.recipient}</p>}
              <p className="letter-content">{letter.content.substring(0, 200)}...</p>
              <p className="letter-date">
                {new Date(letter.letter_date).toLocaleDateString()}
              </p>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDeleteLetter(letter.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
