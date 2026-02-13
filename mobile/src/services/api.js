import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (username, name) =>
    api.post('/auth/register', { username, name, password: username }),
  login: (username) =>
    api.post('/auth/login', { username, password: username }),
  me: () => api.get('/auth/me'),
};

export const galleryAPI = {
  getPhotos: () => api.get('/gallery'),
  uploadPhoto: (formData) =>
    api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePhoto: (id) => api.delete(`/gallery/${id}`),
};

export const storiesAPI = {
  getStories: () => api.get('/stories'),
  createStory: (title, content, storyDate) =>
    api.post('/stories/create', { title, content, story_date: storyDate }),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  updateStory: (id, title, content) =>
    api.put(`/stories/${id}`, { title, content }),
};

export const notesAPI = {
  getNotes: () => api.get('/notes'),
  createNote: (title, content, category) =>
    api.post('/notes/create', { title, content, category }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

export default api;
