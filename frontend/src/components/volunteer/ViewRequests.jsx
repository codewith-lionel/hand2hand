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
    return <div className="loading">🔄 Loading requests...</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const myRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        <h2 className="text-primary mb-4">📋 Exam Requests</h2>

        <h3 className="mt-4 mb-2">⏳ Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">📭 No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="card-grid">
            {pendingRequests.map((request) => (
              <div key={request._id} className="request-card">
                <h4>📖 {request.examDetails.subject}</h4>
                <p><strong>👤 Student:</strong> {request.studentId.userId.name}</p>
                <p><strong>📅 Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {request.examDetails.time}</p>
                <p><strong>⏱️ Duration:</strong> {request.examDetails.duration}</p>
                <p><strong>📝 Type:</strong> {request.examDetails.type}</p>
                <p><strong>📍 Venue:</strong> {request.examDetails.venue}</p>
                {request.requiredQualification && (
                  <p><strong>🎓 Required Qualification:</strong> {request.requiredQualification}</p>
                )}
                {request.specialRequirements && (
                  <p><strong>⚠️ Special Requirements:</strong> {request.specialRequirements}</p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => handleRespond(request._id, 'accepted')}
                    disabled={respondingTo === request._id}
                    className="btn btn-success"
                    style={{ flex: 1 }}
                  >
                    {respondingTo === request._id ? '⏳' : '✅'} Accept
                  </button>
                  <button
                    onClick={() => handleRespond(request._id, 'rejected')}
                    disabled={respondingTo === request._id}
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                  >
                    {respondingTo === request._id ? '⏳' : '❌'} Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="mt-4 mb-2">📝 My Responses</h3>
        {myRequests.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">📭 No responses yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {myRequests.map((request) => (
              <div key={request._id} className="request-card">
                <h4>📖 {request.examDetails.subject}</h4>
                <p><strong>👤 Student:</strong> {request.studentId.userId.name}</p>
                <p><strong>📅 Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`badge badge-${request.status}`}>{request.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;
