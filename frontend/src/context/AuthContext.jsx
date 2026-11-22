import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hireloop_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app boot
  useEffect(() => {
    const storedUser = localStorage.getItem('hireloop_user');
    const storedToken = localStorage.getItem('hireloop_token');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('hireloop_user');
        localStorage.removeItem('hireloop_token');
      }
    }
    setLoading(false);
  }, []);

  // Save session to localStorage
  const saveSession = (authData) => {
    const userData = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      status: authData.status,
      companyId: authData.companyId || null,
      companyName: authData.companyName || null,
      companyApprovalStatus: authData.companyApprovalStatus || null,
    };
    setUser(userData);
    setToken(authData.token);
    localStorage.setItem('hireloop_token', authData.token);
    localStorage.setItem('hireloop_user', JSON.stringify(userData));
  };

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.data) {
      saveSession(response.data.data);
      return response.data.data;
    }
    throw new Error('Invalid response from server');
  };

  // Candidate Registration
  const registerCandidate = async (formData) => {
    const response = await api.post('/auth/register/candidate', formData);
    if (response.data && response.data.data) {
      saveSession(response.data.data);
      return response.data.data;
    }
    throw new Error('Registration failed');
  };

  // Employer Registration
  const registerEmployer = async (formData) => {
    const response = await api.post('/auth/register/employer', formData);
    if (response.data && response.data.data) {
      saveSession(response.data.data);
      return response.data.data;
    }
    throw new Error('Registration failed');
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hireloop_token');
    localStorage.removeItem('hireloop_user');
  };

  // Update user profile in context (e.g. when company status changes)
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('hireloop_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    role: user?.role,
    login,
    registerCandidate,
    registerEmployer,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
