import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminApi';
import axios from 'axios';

const VolunteerVerification = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users?role=volunteer`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      // Fetch volunteer profiles
      const volunteerProfiles = await Promise.all(
        response.data.data.map(async (user) => {
          try {
            const profileRes = await axios.get(
              `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/volunteers/profile`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
              }
            );
            return { user, profile: profileRes.data.data };
          } catch {
            return { user, profile: null };
          }
        })
      );
      
      setVolunteers(volunteerProfiles.filter(v => v.profile));
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
            volunteers.map(({ user, profile }) => (
              <div key={profile._id} className="admin-volunteer-card">
                <h3 className="admin-volunteer-name">👤 {user.name}</h3>
                <div className="admin-volunteer-details">
                  <p><strong>📧 Email:</strong> {user.email}</p>
                  <p><strong>📱 Phone:</strong> {user.phone}</p>
                  <p><strong>🎓 Education:</strong> {profile.education.degree} from {profile.education.institution}</p>
                  <p><strong>📅 Graduation Year:</strong> {profile.education.year}</p>
                  <p><strong>📚 Subjects:</strong> {profile.subjects.join(', ')}</p>
                  <p><strong>🌐 Languages:</strong> {profile.languages.join(', ')}</p>
                  <p><strong>📍 Location:</strong> {profile.location.city}, {profile.location.state}</p>
                  {profile.experience && <p><strong>💼 Experience:</strong> {profile.experience}</p>}
                  <p>
                    <strong>📊 Status:</strong>{' '}
                    {profile.isVerified ? (
                      <span className="admin-badge success">✅ Verified</span>
                    ) : (
                      <span className="admin-badge danger">❌ Not Verified</span>
                    )}
                  </p>
                </div>
                {!profile.isVerified && (
                  <button
                    onClick={() => handleVerify(profile._id)}
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
