import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../../services/api';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getRequests();
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Student Dashboard</h2>
      <div style={styles.actions}>
        <Link to="/student/volunteers" style={styles.actionButton}>
          Find Volunteers
        </Link>
        <Link to="/student/create-request" style={styles.actionButton}>
          Create New Request
        </Link>
        <Link to="/student/profile" style={styles.actionButton}>
          My Profile
        </Link>
      </div>
      
      <div style={styles.section}>
        <h3>Recent Requests</h3>
        {requests.length === 0 ? (
          <p>No requests yet. Start by finding volunteers and creating a request.</p>
        ) : (
          <div style={styles.requestList}>
            {requests.slice(0, 5).map((request) => (
              <div key={request._id} style={styles.requestCard}>
                <h4>{request.examDetails.subject}</h4>
                <p><strong>Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {request.examDetails.time}</p>
                <p><strong>Status:</strong> <span style={getStatusStyle(request.status)}>{request.status}</span></p>
                {request.volunteerId && (
                  <p><strong>Volunteer:</strong> {request.volunteerId.userId.name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = { padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' };
  switch (status) {
    case 'pending':
      return { ...baseStyle, backgroundColor: '#f39c12', color: '#fff' };
    case 'accepted':
      return { ...baseStyle, backgroundColor: '#27ae60', color: '#fff' };
    case 'rejected':
      return { ...baseStyle, backgroundColor: '#e74c3c', color: '#fff' };
    case 'completed':
      return { ...baseStyle, backgroundColor: '#3498db', color: '#fff' };
    default:
      return baseStyle;
  }
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
  actions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  section: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  requestList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  requestCard: {
    border: '1px solid #ddd',
    padding: '1rem',
    borderRadius: '4px'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default StudentDashboard;
