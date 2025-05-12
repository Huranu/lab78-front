import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState({
    access_token: null,
    refresh_token: null,
    expires_at: null,
  });

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
  });

  api.interceptors.request.use(
    (config) => {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        tokenData.refresh_token
      ) {
        originalRequest._retry = true;
        try {
          console.log('Access token expired, attempting to refresh...');
          const { access_token, expires_in } = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const access_token = localStorage.getItem('access_token');
      const refresh_token = localStorage.getItem('refresh_token');
      const expires_at = localStorage.getItem('expires_at');

      if (access_token && refresh_token && expires_at) {
        try {
          const decoded = jwtDecode(access_token);
          setTokenData({
            access_token,
            refresh_token,
            expires_at: parseInt(expires_at),
          });

          const response = await api.get('/auth/profile');
          setUser(response.data.user || { id: decoded.id, email: decoded.email });
        } catch (err) {
          console.error('Auth initialization error:', err);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expires_at');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/refresh', {
        refresh_token: tokenData.refresh_token,
      });
      const { access_token, expires_in, token_type } = response.data;
      const expires_at = Date.now() + expires_in * 1000;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem('expires_at', expires_at.toString());

      setTokenData({
        access_token,
        refresh_token: tokenData.refresh_token,
        expires_at,
      });

      console.log('Token refreshed, new expires_at:', new Date(expires_at));
      return { access_token, expires_in };
    } catch (err) {
      console.error('Refresh token error:', err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    setTokenData({ access_token: null, refresh_token: null, expires_at: null });
    setUser(null);
    console.log('Logged out');
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, api, setTokenData , tokenData}}>
      {children}
    </AuthContext.Provider>
  );
};