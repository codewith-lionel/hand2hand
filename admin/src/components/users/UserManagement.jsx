import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter ? { role: filter } : {};
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Management</h2>

      <div style={styles.filters}>
        <label style={styles.label}>Filter by Role:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="">All Users</option>
          <option value="student">Students</option>
          <option value="volunteer">Volunteers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Verified</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.tr}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>
                  <span style={getRoleBadge(user.role)}>{user.role}</span>
                </td>
                <td style={styles.td}>{user.isVerified ? '✓' : '✗'}</td>
                <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && <p style={styles.noData}>No users found.</p>}
    </div>
  );
};

const getRoleBadge = (role) => {
  const baseStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold'
  };

  switch (role) {
    case 'admin':
      return { ...baseStyle, backgroundColor: '#e74c3c', color: '#fff' };
    case 'volunteer':
      return { ...baseStyle, backgroundColor: '#3498db', color: '#fff' };
    case 'student':
      return { ...baseStyle, backgroundColor: '#27ae60', color: '#fff' };
    default:
      return baseStyle;
  }
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  filters: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  label: {
    fontWeight: '500',
    color: '#34495e'
  },
  select: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: '#34495e',
    color: '#fff',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid #ecf0f1'
  },
  td: {
    padding: '1rem'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d'
  }
};

export default UserManagement;
