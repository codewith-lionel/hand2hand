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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Volunteer Verification</h2>

      <div style={styles.volunteerList}>
        {volunteers.length === 0 ? (
          <p>No volunteers to verify.</p>
        ) : (
          volunteers.map(({ user, profile }) => (
            <div key={profile._id} style={styles.volunteerCard}>
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Education:</strong> {profile.education.degree} from {profile.education.institution}</p>
              <p><strong>Graduation Year:</strong> {profile.education.year}</p>
              <p><strong>Subjects:</strong> {profile.subjects.join(', ')}</p>
              <p><strong>Languages:</strong> {profile.languages.join(', ')}</p>
              <p><strong>Location:</strong> {profile.location.city}, {profile.location.state}</p>
              {profile.experience && <p><strong>Experience:</strong> {profile.experience}</p>}
              <p>
                <strong>Status:</strong>{' '}
                {profile.isVerified ? (
                  <span style={styles.verified}>✓ Verified</span>
                ) : (
                  <span style={styles.unverified}>Not Verified</span>
                )}
              </p>
              {!profile.isVerified && (
                <button
                  onClick={() => handleVerify(profile._id)}
                  style={styles.verifyButton}
                >
                  Verify Volunteer
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  volunteerList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  volunteerCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  verified: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  unverified: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  verifyButton: {
    marginTop: '1rem',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default VolunteerVerification;
