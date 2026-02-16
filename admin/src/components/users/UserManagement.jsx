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
    return <div className="admin-loading">🔄 Loading users...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper admin-fade-in">
        <h2 className="admin-text-primary admin-mb-4">👥 User Management</h2>

        <div className="admin-filter-section">
          <label className="admin-filter-label">🔍 Filter by Role:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="admin-select"
          >
            <option value="">All Users</option>
            <option value="student">🎓 Students</option>
            <option value="volunteer">🤝 Volunteers</option>
            <option value="admin">👨‍💼 Admins</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>👤 Name</th>
                <th>📧 Email</th>
                <th>📱 Phone</th>
                <th>🎭 Role</th>
                <th>✅ Verified</th>
                <th>📅 Joined</th>
                <th>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`admin-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.isVerified ? '✅' : '❌'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="admin-btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="admin-no-data">😕 No users found.</p>
        )}
      </div>
    </div>
  );
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin':
      return 'danger';
    case 'volunteer':
      return 'info';
    case 'student':
      return 'success';
    default:
      return 'default';
  }
};

export default UserManagement;
