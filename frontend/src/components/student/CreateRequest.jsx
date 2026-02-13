import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    examDetails: {
      subject: '',
      date: '',
      time: '',
      duration: '',
      type: 'written',
      venue: ''
    },
    requiredQualification: '',
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
    setLoading(true);
    setMessage('');

    try {
      await studentAPI.createRequest(formData);
      setMessage('Request created successfully!');
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Exam Request</h2>
      {message && (
        <div style={message.includes('Error') ? styles.error : styles.success}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            name="examDetails.subject"
            value={formData.examDetails.subject}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Exam Date</label>
            <input
              type="date"
              name="examDetails.date"
              value={formData.examDetails.date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Exam Time</label>
            <input
              type="time"
              name="examDetails.time"
              value={formData.examDetails.time}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Duration</label>
            <input
              type="text"
              name="examDetails.duration"
              placeholder="e.g., 3 hours"
              value={formData.examDetails.duration}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Exam Type</label>
            <select
              name="examDetails.type"
              value={formData.examDetails.type}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="written">Written</option>
              <option value="practical">Practical</option>
              <option value="oral">Oral</option>
              <option value="online">Online</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Venue</label>
          <input
            type="text"
            name="examDetails.venue"
            value={formData.examDetails.venue}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Required Qualification (Optional)</label>
          <input
            type="text"
            name="requiredQualification"
            value={formData.requiredQualification}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Special Requirements (Optional)</label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Creating...' : 'Create Request'}
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
  }
};

export default CreateRequest;
