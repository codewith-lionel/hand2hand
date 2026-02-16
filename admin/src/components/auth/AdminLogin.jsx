import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-card admin-fade-in">
        <h2 className="admin-form-title">🛡️ Admin Portal</h2>
        <p className="admin-text-center admin-text-secondary admin-mb-3">Login to manage the platform</p>
        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="admin-form-input"
              placeholder="Enter your admin email"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="admin-form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-btn-full">
            {loading ? '🔄 Logging in...' : '🔐 Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
