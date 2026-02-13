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
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Hand2Hand
        </Link>
        <div style={styles.links}>
          {user ? (
            <>
              <span style={styles.user}>
                {user.name} ({user.role})
              </span>
              {user.role === 'student' && (
                <>
                  <Link to="/student/dashboard" style={styles.link}>
                    Dashboard
                  </Link>
                  <Link to="/student/profile" style={styles.link}>
                    Profile
                  </Link>
                  <Link to="/student/volunteers" style={styles.link}>
                    Find Volunteers
                  </Link>
                  <Link to="/student/requests" style={styles.link}>
                    My Requests
                  </Link>
                </>
              )}
              {user.role === 'volunteer' && (
                <>
                  <Link to="/volunteer/dashboard" style={styles.link}>
                    Dashboard
                  </Link>
                  <Link to="/volunteer/profile" style={styles.link}>
                    Profile
                  </Link>
                  <Link to="/volunteer/requests" style={styles.link}>
                    Requests
                  </Link>
                  <Link to="/volunteer/assigned-exams" style={styles.link}>
                    Assigned Exams
                  </Link>
                </>
              )}
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    marginBottom: '2rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem'
  },
  user: {
    color: '#ecf0f1',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '4px'
  }
};

export default Navbar;
