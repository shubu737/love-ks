import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export const HomePage = () => {

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-3 romantic-title">
              <i className="fas fa-heart" style={{ color: '#ff6b9d' }}></i> Love KS
            </h1>
            <p className="lead text-muted">Our beautiful journey together, every moment is precious</p>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6 col-lg-4">
              <Link to="/albums" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-book" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">📚 Albums</h5>
                  <p className="card-text text-muted">Him, Her, Couple & more</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/gallery" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-images" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">🖼️ Gallery</h5>
                  <p className="card-text text-muted">Our beautiful moments</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/stories" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-book-heart" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">💕 Stories</h5>
                  <p className="card-text text-muted">Our love story</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6 col-lg-4">
              <Link to="/letters" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-envelope-heart" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">💌 Letters</h5>
                  <p className="card-text text-muted">Love letters & notes</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/journal" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-book" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">📔 Journal</h5>
                  <p className="card-text text-muted">Daily memories & plans</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/bucket" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-star" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">🎯 Bucket List</h5>
                  <p className="card-text text-muted">Dreams to achieve</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/notes" className="card card-hover romantic-card h-100 text-decoration-none text-dark">
                <div className="card-body text-center py-4">
                  <i className="fas fa-sticky-note" style={{ fontSize: '3rem', color: '#ff6b9d' }}></i>
                  <h5 className="card-title mt-3">📝 Notes</h5>
                  <p className="card-text text-muted">Organized memories</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <div className="text-center p-4 romantic-card">
                <h2 className="display-5" style={{ color: '#ff6b9d' }}>💑</h2>
                <h3 className="h1">2</h3>
                <p className="text-muted">Beautiful Hearts</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4 romantic-card">
                <h2 className="display-5" style={{ color: '#ff6b9d' }}>📸</h2>
                <h3 className="h1">∞</h3>
                <p className="text-muted">Precious Moments</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4 romantic-card">
                <h2 className="display-5" style={{ color: '#ff6b9d' }}>💕</h2>
                <h3 className="h1">Forever</h3>
                <p className="text-muted">Together Always</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
