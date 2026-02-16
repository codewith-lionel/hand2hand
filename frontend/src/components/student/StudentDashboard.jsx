import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, requestAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [requestsRes, profileRes] = await Promise.all([
        studentAPI.getRequests(),
        studentAPI.getProfile().catch(() => null)
      ]);
      
      console.log('Requests response:', requestsRes.data);
      const requestsData = requestsRes.data.data;
      console.log('Requests data:', requestsData);
      setRequests(requestsData);
      setProfile(profileRes?.data?.data || null);
      
      // Calculate stats
      const stats = {
        total: requestsData.length,
        pending: requestsData.filter(r => r.status === 'pending').length,
        accepted: requestsData.filter(r => r.status === 'accepted').length,
        completed: requestsData.filter(r => r.status === 'completed').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMessage('❌ Error loading dashboard data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }
    
    setCancelling(requestId);
    try {
      await requestAPI.cancelRequest(requestId);
      setMessage('✅ Request cancelled successfully!');
      fetchDashboardData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Error cancelling request'));
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading your dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="text-primary" style={{ marginBottom: '0.25rem' }}>📚 Welcome, {user?.name}!</h2>
            <p className="text-secondary">Student Dashboard</p>
          </div>
          {!profile && (
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span style={{ fontWeight: '600' }}>Complete your profile to create requests</span>
            </div>
          )}
        </div>
        
        {message && (
          <div className={message.includes('❌') ? 'alert alert-error' : 'alert alert-success'}>
            {message}
          </div>
        )}
        
        <div className="card-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>📝 Total Requests</p>
          </div>
          <div className="stat-card secondary">
            <h3>{stats.pending}</h3>
            <p>⏳ Pending</p>
          </div>
          <div className="stat-card accent">
            <h3>{stats.accepted}</h3>
            <p>✅ Accepted</p>
          </div>
          <div className="stat-card success">
            <h3>{stats.completed}</h3>
            <p>🎯 Completed</p>
          </div>
        </div>
        
        <div className="btn-group">
          <Link to="/student/volunteers" className="btn btn-primary">
            🔍 Find Volunteers
          </Link>
          <Link to="/student/create-request" className="btn btn-secondary">
            ➕ Create New Request
          </Link>
          <Link to="/student/profile" className="btn btn-outline">
            👤 {profile ? 'Update Profile' : 'Complete Profile'}
          </Link>
        </div>
        
        <h3 className="mt-4 mb-2">📋 Recent Requests</h3>
        {requests.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">📭 No requests yet. Start by {profile ? 'finding volunteers and creating a request' : 'completing your profile'}.</p>
          </div>
        ) : (
          <div className="card-grid">
            {requests.slice(0, 6).map((request) => (
              <div key={request._id} className="request-card">
                <h4>📖 {request.examDetails.subject}</h4>
                <p><strong>📅 Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {request.examDetails.time}</p>
                <p><strong>⏱️ Duration:</strong> {request.examDetails.duration}</p>
                <p><strong>📍 Venue:</strong> {request.examDetails.venue}</p>
                <p><strong>Status:</strong> <span className={`badge badge-${request.status}`}>{request.status}</span></p>
                {request.volunteerId && (
                  <p><strong>👤 Volunteer:</strong> {request.volunteerId.userId.name}</p>
                )}
                {(request.status === 'pending' || request.status === 'accepted') && (
                  <button
                    onClick={() => handleCancelRequest(request._id)}
                    disabled={cancelling === request._id}
                    className="btn btn-danger"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                  >
                    {cancelling === request._id ? '⏳ Cancelling...' : '🚫 Cancel Request'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
