import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminApi';

const VolunteerVerification = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await adminAPI.getAllVolunteers();
      setVolunteers(response.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (volunteerId) => {
    try {
      await adminAPI.verifyVolunteer(volunteerId);
      alert('Volunteer verified successfully');
      fetchVolunteers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error verifying volunteer');
    }
  };

  if (loading) {
    return <div className="admin-loading">🔄 Loading volunteers...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper admin-fade-in">
        <h2 className="admin-text-primary admin-mb-4">🤝 Volunteer Verification</h2>

        <div className="admin-volunteer-grid">
          {volunteers.length === 0 ? (
            <p className="admin-no-data">😕 No volunteers to verify.</p>
          ) : (
            volunteers.map((volunteer) => (
              <div key={volunteer._id} className="admin-volunteer-card">
                <h3 className="admin-volunteer-name">👤 {volunteer.userId?.name}</h3>
                <div className="admin-volunteer-details">
                  <p><strong>📧 Email:</strong> {volunteer.userId?.email}</p>
                  <p><strong>📱 Phone:</strong> {volunteer.userId?.phone}</p>
                  <p><strong>🎓 Education:</strong> {volunteer.education.degree} from {volunteer.education.institution}</p>
                  <p><strong>📅 Graduation Year:</strong> {volunteer.education.year}</p>
                  <p><strong>📚 Subjects:</strong> {volunteer.subjects.join(', ')}</p>
                  <p><strong>🌐 Languages:</strong> {volunteer.languages.join(', ')}</p>
                  <p><strong>📍 Location:</strong> {volunteer.location.city}, {volunteer.location.state}</p>
                  {volunteer.experience && <p><strong>💼 Experience:</strong> {volunteer.experience}</p>}
                  <p>
                    <strong>📊 Status:</strong>{' '}
                    {volunteer.isVerified ? (
                      <span className="admin-badge success">✅ Verified</span>
                    ) : (
                      <span className="admin-badge danger">❌ Not Verified</span>
                    )}
                  </p>
                </div>
                {!volunteer.isVerified && (
                  <button
                    onClick={() => handleVerify(volunteer._id)}
                    className="admin-btn-success admin-full-width"
                  >
                    ✅ Verify Volunteer
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerVerification;
