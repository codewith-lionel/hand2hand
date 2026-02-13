import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/adminApi';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.data.data.role === 'admin') {
            setAdmin(response.data.data);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Error loading admin:', error);
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...adminData } = response.data.data;
      
      if (adminData.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin credentials required.'
        };
      }
      
      localStorage.setItem('adminToken', token);
      setAdmin(adminData);
      return { success: true, admin: adminData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export default AdminAuthContext;
