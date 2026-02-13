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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{profile ? 'Update' : 'Create'} Student Profile</h2>
      {message && (
        <div style={message.includes('Error') ? styles.error : styles.success}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Disability Type</label>
          <select
            name="disabilityType"
            value={formData.disabilityType}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="visual">Visual</option>
            <option value="hearing">Hearing</option>
            <option value="mobility">Mobility</option>
            <option value="learning">Learning</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Disability Details</label>
          <textarea
            name="disabilityDetails"
            value={formData.disabilityDetails}
            onChange={handleChange}
            required
            rows="3"
            style={styles.textarea}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode</label>
            <input
              type="text"
              name="location.pincode"
              value={formData.location.pincode}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Education Level</label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="high_school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
            <option value="doctorate">Doctorate</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Institution</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Roll Number (Optional)</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem',
    flex: 1
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  success: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default StudentProfile;
