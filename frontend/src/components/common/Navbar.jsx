import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🤝 Hand2Hand
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span className="navbar-user">
                👤 {user.name} ({user.role})
              </span>
              {user.role === 'student' && (
                <>
                  <Link to="/student/dashboard" className="navbar-link">
                    📊 Dashboard
                  </Link>
                  <Link to="/student/profile" className="navbar-link">
                    👤 Profile
                  </Link>
                  <Link to="/student/volunteers" className="navbar-link">
                    🔍 Find Volunteers
                  </Link>
                  <Link to="/student/requests" className="navbar-link">
                    📝 My Requests
                  </Link>
                </>
              )}
              {user.role === 'volunteer' && (
                <>
                  <Link to="/volunteer/dashboard" className="navbar-link">
                    📊 Dashboard
                  </Link>
                  <Link to="/volunteer/profile" className="navbar-link">
                    👤 Profile
                  </Link>
                  <Link to="/volunteer/requests" className="navbar-link">
                    📋 Requests
                  </Link>
                  <Link to="/volunteer/assigned-exams" className="navbar-link">
                    ✅ Assigned Exams
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="navbar-button">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                🔑 Login
              </Link>
              <Link to="/register" className="navbar-link">
                ✨ Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
