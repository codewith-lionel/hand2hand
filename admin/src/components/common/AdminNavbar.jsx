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
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/admin" style={styles.brand}>
          Hand2Hand Admin
        </Link>
        <div style={styles.links}>
          {admin ? (
            <>
              <span style={styles.user}>{admin.name}</span>
              <Link to="/admin/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/admin/users" style={styles.link}>
                Users
              </Link>
              <Link to="/admin/volunteers" style={styles.link}>
                Volunteers
              </Link>
              <Link to="/admin/requests" style={styles.link}>
                Requests
              </Link>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#34495e',
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

export default AdminNavbar;
