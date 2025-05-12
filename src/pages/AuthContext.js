import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Checking authentication status...');
    axios
      .get('http://localhost:8000/api/auth/profile', { withCredentials: true })
      .then((response) => {
        console.log('Profile response:', response.data);
        setUser(response.data.user || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profile fetch error:', err.response?.data || err.message);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    try {
      console.log('Logging out...');
      await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};