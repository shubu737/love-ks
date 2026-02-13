import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me')
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  upload: (formData) => api.post('/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/gallery/${id}`)
};

export const storiesAPI = {
  getAll: () => api.get('/stories'),
  create: (data) => api.post('/stories/create', data),
  update: (id, data) => api.put(`/stories/${id}`, data),
  delete: (id) => api.delete(`/stories/${id}`)
};

export const notesAPI = {
  getAll: () => api.get('/notes'),
  create: (data) => api.post('/notes/create', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`)
};

export const albumsAPI = {
  getAll: () => api.get('/albums'),
  create: (data) => api.post('/albums/create', data),
  getById: (id) => api.get(`/albums/${id}`),
  addPhoto: (albumId, photoId) => api.post(`/albums/${albumId}/photos`, { photo_id: photoId }),
  delete: (id) => api.delete(`/albums/${id}`)
};

export const lettersAPI = {
  getAll: () => api.get('/letters'),
  create: (data) => api.post('/letters/create', data),
  getByType: (type) => api.get(`/letters/type/${type}`),
  update: (id, data) => api.put(`/letters/${id}`, data),
  delete: (id) => api.delete(`/letters/${id}`)
};

export const bucketAPI = {
  getAll: () => api.get('/bucket'),
  create: (data) => api.post('/bucket/create', data),
  complete: (id) => api.patch(`/bucket/${id}/complete`),
  delete: (id) => api.delete(`/bucket/${id}`)
};

export const journalAPI = {
  getAll: () => api.get('/journal'),
  create: (formData) => api.post('/journal/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getById: (id) => api.get(`/journal/${id}`),
  update: (id, data) => api.put(`/journal/${id}`, data),
  delete: (id) => api.delete(`/journal/${id}`)
};

export default api;
