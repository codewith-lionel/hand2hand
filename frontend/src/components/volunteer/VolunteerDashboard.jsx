import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { volunteerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    total: 0
  });
  const [profile, setProfile] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [requestsRes, assignedRes, profileRes] = await Promise.all([
        volunteerAPI.getRequests(),
        volunteerAPI.getAssignedExams(),
        volunteerAPI.getProfile().catch(() => null)
      ]);
      
      const allRequests = requestsRes.data.data;
      const assignedExams = assignedRes.data.data;
      
      const pending = allRequests.filter(r => r.status === 'pending').length;
      const accepted = assignedExams.filter(e => e.status === 'accepted').length;
      const completed = assignedExams.filter(e => e.status === 'completed').length;
      const total = assignedExams.length;
      
      setStats({ pending, accepted, completed, total });
      setRecentRequests(allRequests.filter(r => r.status === 'pending').slice(0, 3));
      setProfile(profileRes?.data?.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
            <h2 className="text-primary" style={{ marginBottom: '0.25rem' }}>🤝 Welcome, {user?.name}!</h2>
            <p className="text-secondary">Volunteer Dashboard</p>
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
              <span style={{ fontWeight: '600' }}>Complete your profile to accept requests</span>
            </div>
          )}
          {profile && !profile.isVerified && (
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⏳</span>
              <span style={{ fontWeight: '600' }}>Pending admin verification</span>
            </div>
          )}
        </div>
        
        <div className="card-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <h3>{stats.pending}</h3>
            <p>⏳ Pending Requests</p>
          </div>
          <div className="stat-card secondary">
            <h3>{stats.accepted}</h3>
            <p>📝 Active Exams</p>
          </div>
          <div className="stat-card success">
            <h3>{stats.completed}</h3>
            <p>✅ Completed Exams</p>
          </div>
          <div className="stat-card accent">
            <h3>{stats.total}</h3>
            <p>📊 Total Assignments</p>
          </div>
        </div>

        <div className="btn-group">
          <Link to="/volunteer/requests" className="btn btn-primary">
            📋 View Requests
          </Link>
          <Link to="/volunteer/assigned-exams" className="btn btn-success">
            ✅ My Assigned Exams
          </Link>
          <Link to="/volunteer/profile" className="btn btn-outline">
            👤 {profile ? 'Update Profile' : 'Complete Profile'}
          </Link>
        </div>

        {recentRequests.length > 0 && profile?.isVerified && (
          <>
            <h3 className="mt-4 mb-2">🔔 Recent Pending Requests</h3>
            <div className="card-grid">
              {recentRequests.map((request) => (
                <div key={request._id} className="request-card">
                  <h4>📖 {request.examDetails.subject}</h4>
                  <p><strong>👤 Student:</strong> {request.studentId.userId.name}</p>
                  <p><strong>📅 Date:</strong> {new Date(request.examDetails.date).toLocaleDateString()}</p>
                  <p><strong>🕐 Time:</strong> {request.examDetails.time}</p>
                  <p><strong>📍 Venue:</strong> {request.examDetails.venue}</p>
                  <Link to="/volunteer/requests" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                    👁️ View Details
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!profile?.isVerified && profile && (
          <div className="card text-center" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: 'var(--warning-color)', marginBottom: '1rem' }}>⏳ Verification Pending</h3>
            <p className="text-secondary">
              Your profile is under review. Once an admin verifies your credentials, you'll be able to view and accept exam requests from students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
