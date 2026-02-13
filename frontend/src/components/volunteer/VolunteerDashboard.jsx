import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { volunteerAPI } from '../../services/api';

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [requestsRes, assignedRes] = await Promise.all([
        volunteerAPI.getRequests(),
        volunteerAPI.getAssignedExams()
      ]);
      
      const pending = requestsRes.data.data.filter(r => r.status === 'pending').length;
      const accepted = assignedRes.data.data.length;
      
      setStats({ pending, accepted });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Volunteer Dashboard</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>{stats.pending}</h3>
          <p>Pending Requests</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats.accepted}</h3>
          <p>Assigned Exams</p>
        </div>
      </div>

      <div style={styles.actions}>
        <Link to="/volunteer/requests" style={styles.actionButton}>
          View Requests
        </Link>
        <Link to="/volunteer/assigned-exams" style={styles.actionButton}>
          My Assigned Exams
        </Link>
        <Link to="/volunteer/profile" style={styles.actionButton}>
          My Profile
        </Link>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
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
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default VolunteerDashboard;
