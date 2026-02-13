import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { adminAPI } from '../../services/adminApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const chartData = {
    labels: ['Pending', 'Accepted', 'Completed', 'Rejected', 'Cancelled'],
    datasets: [
      {
        label: 'Requests',
        data: [
          stats?.requests.pending || 0,
          stats?.requests.accepted || 0,
          stats?.requests.completed || 0,
          stats?.requests.rejected || 0,
          stats?.requests.cancelled || 0
        ],
        backgroundColor: [
          'rgba(243, 156, 18, 0.6)',
          'rgba(39, 174, 96, 0.6)',
          'rgba(52, 152, 219, 0.6)',
          'rgba(231, 76, 60, 0.6)',
          'rgba(149, 165, 166, 0.6)'
        ],
        borderColor: [
          'rgba(243, 156, 18, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(149, 165, 166, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Request Status Distribution'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>{stats?.users.total || 0}</h3>
          <p>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats?.users.students || 0}</h3>
          <p>Students</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats?.users.volunteers || 0}</h3>
          <p>Volunteers</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats?.users.verifiedVolunteers || 0}</h3>
          <p>Verified Volunteers</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats?.requests.total || 0}</h3>
          <p>Total Requests</p>
        </div>
        <div style={styles.statCard}>
          <h3>{stats?.requests.completed || 0}</h3>
          <p>Completed Exams</p>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default Dashboard;
