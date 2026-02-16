import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
      if (result.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (result.user.role === 'volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card fade-in">
        <h2 className="form-title">✨ Welcome Back</h2>
        <p className="text-center text-secondary mb-3">Login to Hand2Hand</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>
        <p className="link-text">
          Don't have an account? <Link to="/register" className="link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
