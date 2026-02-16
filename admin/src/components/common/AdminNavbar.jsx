import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminNavbar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <Link to="/admin" className="admin-navbar-brand">
          🛡️ Hand2Hand Admin
        </Link>
        <div className="admin-navbar-links">
          {admin ? (
            <>
              <span className="admin-navbar-user">
                👤 {admin.name}
              </span>
              <Link to="/admin/dashboard" className="admin-navbar-link">
                📊 Dashboard
              </Link>
              <Link to="/admin/users" className="admin-navbar-link">
                👥 Users
              </Link>
              <Link to="/admin/volunteers" className="admin-navbar-link">
                🤝 Volunteers
              </Link>
              <Link to="/admin/requests" className="admin-navbar-link">
                📋 Requests
              </Link>
              <button onClick={handleLogout} className="admin-navbar-button">
                🚪 Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
