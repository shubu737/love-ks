import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../api';
import socketService from '../socket';
import { compressImage, getFileSize } from '../imageUtils';
import '../styles/pages.css';

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoDate: ''
  });
  const [uploading, setUploading] = useState(false);
  const [fileSize, setFileSize] = useState('');

  useEffect(() => {
    loadPhotos();
    
    // Subscribe to real-time updates
    socketService.on('photo-uploaded', (photo) => {
      setPhotos(prev => [photo, ...prev]);
      console.log('New photo added via WebSocket:', photo);
    });

    socketService.on('photo-deleted', (data) => {
      setPhotos(prev => prev.filter(p => p.id !== data.id));
      console.log('Photo deleted via WebSocket');
    });

    return () => {
      socketService.off('photo-uploaded', null);
      socketService.off('photo-deleted', null);
    };
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await galleryAPI.getAll();
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSize(`Original: ${getFileSize(file.size)}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const fileInput = e.target.querySelector('input[type="file"]');
      
      if (!fileInput.files[0]) {
        alert('Please select a photo');
        return;
      }

      setUploading(true);
      let file = fileInput.files[0];
      const originalSize = file.size;

      // Compress image
      file = await compressImage(file);
      console.log(`Compression: ${getFileSize(originalSize)} → ${getFileSize(file.size)}`);

      const form = new FormData();
      form.append('photo', file);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('photoDate', formData.photoDate);

      const response = await galleryAPI.upload(form);
      
      if (response.data.photo) {
        setPhotos(prev => [response.data.photo, ...prev]);
      }
      
      alert(`Photo uploaded successfully!\nCompressed: ${getFileSize(originalSize)} → ${getFileSize(file.size)}`);
      setFormData({ title: '', description: '', photoDate: '' });
      setFileSize('');
      e.target.reset();
    } catch (error) {
      alert('Error uploading photo: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this photo?')) {
      try {
        await galleryAPI.delete(id);
        loadPhotos();
      } catch (error) {
        alert('Error deleting photo');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="col-lg-10 mx-auto">
        <h1 className="display-4 mb-2"><i className="fas fa-images" style={{ color: '#ff6b9d' }}></i> Photo Gallery</h1>
        <p className="text-muted">Capture and cherish every beautiful moment together</p>

        <div className="romantic-card p-4 mb-5">
          <h4 className="mb-3"><i className="fas fa-camera"></i> Add New Photo</h4>
          <form onSubmit={handleUpload}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="photoTitle" className="form-label">Photo Title</label>
                <input
                  type="text"
                  className="form-control romantic-input"
                  id="photoTitle"
                  placeholder="e.g., Our first kiss"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="photoDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control romantic-input"
                  id="photoDate"
                  value={formData.photoDate}
                  onChange={(e) => setFormData({...formData, photoDate: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="photoDescription" className="form-label">Description</label>
              <textarea
                className="form-control romantic-input"
                id="photoDescription"
                rows="2"
                placeholder="Tell the story behind this photo..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="photoFile" className="form-label">Choose Photo</label>
              <input
                type="file"
                className="form-control romantic-input"
                id="photoFile"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <small className="text-muted d-block">Max original: 10MB. Supported: JPG, PNG, GIF</small>
              {fileSize && <small className="text-success d-block">{fileSize}</small>}
            </div>
            <button type="submit" className="btn romantic-btn btn-lg w-100" disabled={uploading}>
              <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i> {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        </div>

        {photos.length > 0 ? (
          <div className="row g-3">
            {photos.map(photo => (
              <div key={photo.id} className="col-md-6 col-lg-4">
                <div className="card romantic-card photo-card">
                  <img src={`/uploads/${photo.filename}`} className="card-img-top photo-img" alt={photo.title} />
                  <div className="card-body">
                    <h5 className="card-title">{photo.title || 'Untitled'}</h5>
                    <p className="card-text text-muted small">{photo.description || 'No description'}</p>
                    <small className="text-muted">
                      <i className="fas fa-calendar"></i> {photo.photo_date || 'No date'}
                    </small>
                    <div className="mt-3">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(photo.id)}>
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
            <i className="fas fa-image" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p className="text-muted mt-3">No photos yet. Start by uploading your first memory!</p>
          </div>
        )}
      </div>
    </div>
  );
};
