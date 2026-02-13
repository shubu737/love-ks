import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import StorageService from '../services/storage';
import SocketService from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const savedToken = await StorageService.getToken();
      const savedUser = await StorageService.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        // Connect socket with saved token
        SocketService.connect(savedToken);
      }
    } catch (err) {
      console.error('Error checking user session:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(username, name);
      const { token: newToken } = response.data;

      await StorageService.setToken(newToken);
      setToken(newToken);

      // Get user info
      const userResponse = await authAPI.me();
      const userData = userResponse.data.user;
      await StorageService.setUser(userData);
      setUser(userData);

      // Connect socket
      SocketService.connect(newToken);

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(username);
      const { token: newToken } = response.data;

      await StorageService.setToken(newToken);
      setToken(newToken);

      // Get user info
      const userResponse = await authAPI.me();
      const userData = userResponse.data.user;
      await StorageService.setUser(userData);
      setUser(userData);

      // Connect socket
      SocketService.connect(newToken);

      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await StorageService.clearAuth();
      setUser(null);
      setToken(null);
      SocketService.disconnect();
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
