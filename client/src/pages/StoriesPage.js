import React, { useState, useEffect } from 'react';
import { storiesAPI } from '../api';
import socketService from '../socket';
import '../styles/pages.css';

export const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    storyDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStories();

    // Subscribe to real-time updates
    socketService.on('story-created', (story) => {
      setStories(prev => [story, ...prev]);
      console.log('New story added via WebSocket:', story);
    });

    socketService.on('story-deleted', (data) => {
      setStories(prev => prev.filter(s => s.id !== data.id));
      console.log('Story deleted via WebSocket');
    });

    return () => {
      socketService.off('story-created', null);
      socketService.off('story-deleted', null);
    };
  }, []);

  const loadStories = async () => {
    try {
      const response = await storiesAPI.getAll();
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await storiesAPI.create(formData);
      
      if (response.data.story) {
        setStories(prev => [response.data.story, ...prev]);
      }
      
      alert('Story saved!');
      setFormData({ title: '', content: '', storyDate: '' });
    } catch (error) {
      alert('Error saving story: ' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this story?')) {
      try {
        await storiesAPI.delete(id);
        loadStories();
      } catch (error) {
        alert('Error deleting story');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="col-lg-10 mx-auto">
        <h1 className="display-4 mb-2"><i className="fas fa-book-heart" style={{ color: '#ff6b9d' }}></i> Our Love Stories</h1>
        <p className="text-muted">Write down the moments that matter most</p>

        <div className="romantic-card p-4 mb-5">
          <h4 className="mb-3"><i className="fas fa-pen"></i> Write a New Story</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="storyTitle" className="form-label">Story Title</label>
                <input
                  type="text"
                  className="form-control romantic-input"
                  id="storyTitle"
                  placeholder="e.g., The day we met"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="storyDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control romantic-input"
                  id="storyDate"
                  value={formData.storyDate}
                  onChange={(e) => setFormData({...formData, storyDate: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="storyContent" className="form-label">Your Story</label>
              <textarea
                className="form-control romantic-input"
                id="storyContent"
                rows="5"
                placeholder="Tell your beautiful love story..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn romantic-btn btn-lg w-100" disabled={submitting}>
              <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-heart'}`}></i> {submitting ? 'Saving...' : 'Save Story'}
            </button>
          </form>
        </div>

        {stories.length > 0 ? (
          stories.map(story => (
            <div key={story.id} className="card romantic-card mb-4 story-card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="card-title">{story.title}</h5>
                    <small className="text-muted d-block mb-3">
                      <i className="fas fa-calendar-heart"></i> {story.story_date || 'No date'}
                    </small>
                    <p className="card-text">{story.content.substring(0, 200)}...</p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(story.id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-5 romantic-card">
            <i className="fas fa-book" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p className="text-muted mt-3">No stories yet. Start writing your first love story!</p>
          </div>
        )}
      </div>
    </div>
  );
};
