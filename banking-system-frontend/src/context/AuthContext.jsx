import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate active backend session on startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('credo_user', JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('credo_user');
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('credo_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Global response interceptor for 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response && err.response.status === 401) {
          setUser(null);
          localStorage.removeItem('credo_user');
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const loggedUser = response.data.user;
      setUser(loggedUser);
      localStorage.setItem('credo_user', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const registeredUser = response.data.user;
      setUser(registeredUser);
      localStorage.setItem('credo_user', JSON.stringify(registeredUser));
      return registeredUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      localStorage.removeItem('credo_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
