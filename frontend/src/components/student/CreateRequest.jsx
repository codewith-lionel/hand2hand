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
      console.log('Creating request with data:', formData);
      const response = await studentAPI.createRequest(formData);
      console.log('Request created successfully:', response.data);
      setMessage('Request created successfully!');
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (error) {
      console.error('Error creating request:', error);
      setMessage(error.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="form-title">📝 Create Exam Request</h2>
        {message && (
          <div className={message.includes('Error') ? 'alert alert-error' : 'alert alert-success'}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="examDetails.subject"
              value={formData.examDetails.subject}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Mathematics, Physics"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">📅 Exam Date</label>
              <input
                type="date"
                name="examDetails.date"
                value={formData.examDetails.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">🕐 Exam Time</label>
              <input
                type="time"
                name="examDetails.time"
                value={formData.examDetails.time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">⏱️ Duration</label>
              <input
                type="text"
                name="examDetails.duration"
                placeholder="e.g., 3 hours"
                value={formData.examDetails.duration}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">📝 Exam Type</label>
              <select
                name="examDetails.type"
                value={formData.examDetails.type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="written">✍️ Written</option>
                <option value="practical">🔬 Practical</option>
                <option value="oral">🗣️ Oral</option>
                <option value="online">💻 Online</option>
                <option value="other">➕ Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📍 Venue</label>
            <input
              type="text"
              name="examDetails.venue"
              value={formData.examDetails.venue}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter exam venue"
            />
          </div>

          <div className="form-group">
            <label className="form-label">🎓 Required Qualification (Optional)</label>
            <input
              type="text"
              name="requiredQualification"
              value={formData.requiredQualification}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., B.Sc. in Mathematics"
            />
          </div>

          <div className="form-group">
            <label className="form-label">⚠️ Special Requirements (Optional)</label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Any special requirements or additional information"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? '⏳ Creating...' : '✨ Create Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
