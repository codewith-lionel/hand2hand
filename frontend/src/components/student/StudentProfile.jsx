import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    disabilityType: 'visual',
    disabilityDetails: '',
    location: {
      city: '',
      state: '',
      pincode: ''
    },
    educationLevel: 'undergraduate',
    institution: '',
    rollNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data.data);
      setFormData({
        disabilityType: response.data.data.disabilityType,
        disabilityDetails: response.data.data.disabilityDetails,
        location: response.data.data.location,
        educationLevel: response.data.data.educationLevel,
        institution: response.data.data.institution,
        rollNumber: response.data.data.rollNumber || ''
      });
    } catch (error) {
      console.log('No profile found, create one');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profile) {
        await studentAPI.updateProfile(formData);
        setMessage('Profile updated successfully!');
      } else {
        await studentAPI.createProfile(formData);
        setMessage('Profile created successfully!');
        navigate('/student/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading profile...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="form-title">{profile ? '✏️ Update' : '✨ Create'} Student Profile</h2>
        {message && (
          <div className={message.includes('Error') ? 'alert alert-error' : 'alert alert-success'}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Disability Type</label>
            <select
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="visual">👁️ Visual</option>
              <option value="hearing">👂 Hearing</option>
              <option value="mobility">🦽 Mobility</option>
              <option value="learning">📚 Learning</option>
              <option value="other">➕ Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Disability Details</label>
            <textarea
              name="disabilityDetails"
              value={formData.disabilityDetails}
              onChange={handleChange}
              required
              rows="3"
              className="form-textarea"
              placeholder="Please provide details about your disability"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your city"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your state"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Pincode"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Education Level</label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="high_school">🎓 High School</option>
              <option value="undergraduate">📚 Undergraduate</option>
              <option value="postgraduate">🎯 Postgraduate</option>
              <option value="doctorate">🏆 Doctorate</option>
              <option value="other">➕ Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your institution name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number (Optional)</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your roll number"
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-full">
            {saving ? '💾 Saving...' : profile ? '✅ Update Profile' : '✨ Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
