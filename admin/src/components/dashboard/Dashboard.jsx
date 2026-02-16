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
    return <div className="admin-loading">🔄 Loading statistics...</div>;
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
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(148, 163, 184, 0.8)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(148, 163, 184, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: '📊 Request Status Distribution',
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper admin-fade-in">
        <h2 className="admin-text-primary admin-mb-4">📊 Admin Dashboard</h2>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>{stats?.users.total || 0}</h3>
            <p>👥 Total Users</p>
          </div>
          <div className="admin-stat-card secondary">
            <h3>{stats?.users.students || 0}</h3>
            <p>🎓 Students</p>
          </div>
          <div className="admin-stat-card accent">
            <h3>{stats?.users.volunteers || 0}</h3>
            <p>🤝 Volunteers</p>
          </div>
          <div className="admin-stat-card success">
            <h3>{stats?.users.verifiedVolunteers || 0}</h3>
            <p>✅ Verified Volunteers</p>
          </div>
          <div className="admin-stat-card info">
            <h3>{stats?.requests.total || 0}</h3>
            <p>📝 Total Requests</p>
          </div>
          <div className="admin-stat-card warning">
            <h3>{stats?.requests.completed || 0}</h3>
            <p>🎯 Completed Exams</p>
          </div>
        </div>

        <div className="admin-chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
