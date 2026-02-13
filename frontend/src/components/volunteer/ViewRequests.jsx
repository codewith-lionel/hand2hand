import React, { useEffect, useState } from 'react';
import { volunteerAPI } from '../../services/api';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await volunteerAPI.getRequests();
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    setRespondingTo(requestId);
    try {
      await volunteerAPI.respondToRequest(requestId, { status });
      alert(`Request ${status} successfully!`);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Error responding to request');
    } finally {
      setRespondingTo(null);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const myRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Exam Requests</h2>

      <div style={styles.section}>
        <h3>Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          <div style={styles.requestList}>
            {pendingRequests.map((request) => (
              <div key={request._id} style={styles.requestCard}>
                <h4>{request.examDetails.subject}</h4>
                <p><strong>Student:</strong> {request.studentId.userId.name}</p>
                <p><strong>Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {request.examDetails.time}</p>
                <p><strong>Duration:</strong> {request.examDetails.duration}</p>
                <p><strong>Type:</strong> {request.examDetails.type}</p>
                <p><strong>Venue:</strong> {request.examDetails.venue}</p>
                {request.requiredQualification && (
                  <p><strong>Required Qualification:</strong> {request.requiredQualification}</p>
                )}
                {request.specialRequirements && (
                  <p><strong>Special Requirements:</strong> {request.specialRequirements}</p>
                )}
                <div style={styles.actions}>
                  <button
                    onClick={() => handleRespond(request._id, 'accepted')}
                    disabled={respondingTo === request._id}
                    style={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(request._id, 'rejected')}
                    disabled={respondingTo === request._id}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h3>My Responses</h3>
        {myRequests.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          <div style={styles.requestList}>
            {myRequests.map((request) => (
              <div key={request._id} style={styles.requestCard}>
                <h4>{request.examDetails.subject}</h4>
                <p><strong>Student:</strong> {request.studentId.userId.name}</p>
                <p><strong>Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style={getStatusStyle(request.status)}>{request.status}</span></p>
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
    case 'accepted':
      return { ...baseStyle, backgroundColor: '#27ae60', color: '#fff' };
    case 'rejected':
      return { ...baseStyle, backgroundColor: '#e74c3c', color: '#fff' };
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
  section: {
    marginBottom: '3rem'
  },
  requestList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem'
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  acceptButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  rejectButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#e74c3c',
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

export default ViewRequests;
