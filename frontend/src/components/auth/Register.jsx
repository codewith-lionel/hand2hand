import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      if (result.user.role === 'student') {
        navigate('/student/profile');
      } else if (result.user.role === 'volunteer') {
        navigate('/volunteer/profile');
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
        <h2 className="form-title">🎓 Join Hand2Hand</h2>
        <p className="text-center text-secondary mb-3">Create your account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
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
              minLength="6"
              className="form-input"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="student">🎓 Student</option>
              <option value="volunteer">🤝 Volunteer</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>
        </form>
        <p className="link-text">
          Already have an account? <Link to="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
