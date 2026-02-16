import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminPrivateRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return <div className="admin-loading">🔄 Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminPrivateRoute;
