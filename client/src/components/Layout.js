import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

export const Navigation = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top romantic-nav">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-heart" style={{ color: '#ff6b9d' }}></i> <strong>Love KS</strong>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/albums">📚 Albums</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/gallery">🖼️ Gallery</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/stories">💕 Stories</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/letters">💌 Letters</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/journal">📔 Journal</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/bucket">🎯 Bucket</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/notes">📝 Notes</Link></li>
            <li className="nav-item">
              <span className="nav-text me-3">Welcome, {user.name}!</span>
              <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="footer mt-5 py-4 bg-light border-top">
      <div className="container text-center">
        <p className="text-muted">
          <i className="fas fa-heart" style={{ color: '#ff6b9d' }}></i> 
          Made with love for two beautiful hearts
        </p>
      </div>
    </footer>
  );
};
