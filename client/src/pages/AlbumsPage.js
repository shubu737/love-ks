import React, { useState, useEffect } from 'react';
import { albumsAPI, galleryAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other'
  });
  const [loading, setLoading] = useState(false);

  const ALBUM_CATEGORIES = [
    { value: 'him', label: '💙 Him' },
    { value: 'her', label: '💗 Her' },
    { value: 'couple', label: '💕 Couple' },
    { value: 'other', label: '📸 Other' }
  ];

  useEffect(() => {
    loadAlbums();
    loadPhotos();

    socketService.on('album-created', (album) => {
      setAlbums(prev => [album, ...prev]);
    });

    socketService.on('album-deleted', (id) => {
      setAlbums(prev => prev.filter(a => a.id !== id));
    });

    return () => {
      socketService.off('album-created', null);
      socketService.off('album-deleted', null);
    };
  }, []);

  const loadAlbums = async () => {
    try {
      const response = await albumsAPI.getAll();
      setAlbums(response.data.albums || []);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      const response = await galleryAPI.getAll();
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an album name');
      return;
    }

    setLoading(true);
    try {
      await albumsAPI.create(formData);
      setFormData({ name: '', description: '', category: 'other' });
      setShowForm(false);
    } catch (error) {
      alert('Error creating album');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (window.confirm('Delete this album?')) {
      try {
        await albumsAPI.delete(id);
        setSelectedAlbum(null);
      } catch (error) {
        alert('Error deleting album');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Albums</h1>
        <button 
          className="btn btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Album'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateAlbum}>
          <input
            type="text"
            placeholder="Album name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
          />
          <textarea
            placeholder="Description"
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
            {ALBUM_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      )}

      <div className="albums-grid">
        {albums.map(album => (
          <div
            key={album.id}
            className="album-card"
            onClick={() => setSelectedAlbum(album)}
            style={{ cursor: 'pointer' }}
          >
            <div className="album-icon">📁</div>
            <h3>{album.name}</h3>
            <p>{album.description}</p>
            <span className="album-category">{album.category}</span>
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div className="modal-overlay" onClick={() => setSelectedAlbum(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAlbum.name}</h2>
            <p>{selectedAlbum.description}</p>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteAlbum(selectedAlbum.id)}
            >
              Delete Album
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedAlbum(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
