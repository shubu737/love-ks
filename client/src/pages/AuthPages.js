import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="row w-100">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-lg romantic-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="display-4 romantic-heart" style={{ color: '#ff6b9d' }}>
                  <i className="fas fa-heart"></i>
                </h1>
                <h2 className="h3 text-dark">Our Love Story</h2>
                <p className="text-muted">Welcome back to our memories</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control romantic-input"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control romantic-input"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-lg w-100 romantic-btn" disabled={loading}>
                  <i className="fas fa-sign-in-alt"></i> {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">Don't have an account?</p>
                <a href="/register" className="romantic-link">Create one together</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData.username, formData.password, formData.confirmPassword, formData.name);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="row w-100">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-lg romantic-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="display-4 romantic-heart" style={{ color: '#ff6b9d' }}>
                  <i className="fas fa-heart"></i>
                </h1>
                <h2 className="h3 text-dark">Start Your Love Story</h2>
                <p className="text-muted">Create an account together</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Names (e.g., John & Jane)</label>
                  <input
                    type="text"
                    className="form-control romantic-input"
                    id="name"
                    placeholder="Both names"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control romantic-input"
                    id="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control romantic-input"
                    id="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control romantic-input"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-lg w-100 romantic-btn" disabled={loading}>
                  <i className="fas fa-heart"></i> {loading ? 'Registering...' : 'Register & Start Sharing'}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">Already have an account?</p>
                <a href="/login" className="romantic-link">Log in here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
