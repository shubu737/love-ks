import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navigation, Footer } from './components/Layout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { StoriesPage } from './pages/StoriesPage';
import { NotesPage } from './pages/NotesPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { LettersPage } from './pages/LettersPage';
import { BucketlistPage } from './pages/BucketlistPage';
import { JournalPage } from './pages/JournalPage';
import './styles/layout.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navigation />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/albums" element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
        <Route path="/stories" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/letters" element={<ProtectedRoute><LettersPage /></ProtectedRoute>} />
        <Route path="/bucket" element={<ProtectedRoute><BucketlistPage /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      </Routes>
      {user && <Footer />}
    </Router>
  );
}

export default App;
