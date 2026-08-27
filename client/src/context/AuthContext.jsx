import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('codesphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [error, setError] = useState('');

  useEffect(() => {
    // Validate stored token on startup
    const checkAuth = async () => {
      const token = localStorage.getItem('codesphere_token');
      if (token && !user) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('codesphere_user', JSON.stringify(res.data));
        } catch (err) {
          logout();
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('codesphere_token', token);
      localStorage.setItem('codesphere_user', JSON.stringify(userData));
      setUser(userData);
      setAuthModal(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('codesphere_token', token);
      localStorage.setItem('codesphere_user', JSON.stringify(userData));
      setUser(userData);
      setAuthModal(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('codesphere_token');
    localStorage.removeItem('codesphere_user');
    setUser(null);
  };

  // Quick Demo Guest Login so user can start testing instantly with 1 click
  const loginAsGuest = async () => {
    const guestUser = {
      _id: 'guest_user_101',
      name: 'Developer Guest',
      email: 'guest@codesphere.ai',
    };
    setUser(guestUser);
    localStorage.setItem('codesphere_user', JSON.stringify(guestUser));
    setAuthModal(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        authModal,
        setAuthModal,
        login,
        register,
        logout,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
