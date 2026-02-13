import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminApi';

const RequestReports = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await adminAPI.getAllRequests(params);
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
      <h2 style={styles.title}>Request Reports</h2>

      <div style={styles.filters}>
        <label style={styles.label}>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Volunteer</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Venue</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} style={styles.tr}>
                <td style={styles.td}>{request.examDetails.subject}</td>
                <td style={styles.td}>{request.studentId?.userId?.name || 'N/A'}</td>
                <td style={styles.td}>{request.volunteerId?.userId?.name || 'Unassigned'}</td>
                <td style={styles.td}>{new Date(request.examDetails.date).toLocaleDateString()}</td>
                <td style={styles.td}>{request.examDetails.time}</td>
                <td style={styles.td}>{request.examDetails.venue}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(request.status)}>{request.status}</span>
                </td>
                <td style={styles.td}>{new Date(request.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && <p style={styles.noData}>No requests found.</p>}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold'
  };

  switch (status) {
    case 'pending':
      return { ...baseStyle, backgroundColor: '#f39c12', color: '#fff' };
    case 'accepted':
      return { ...baseStyle, backgroundColor: '#27ae60', color: '#fff' };
    case 'completed':
      return { ...baseStyle, backgroundColor: '#3498db', color: '#fff' };
    case 'rejected':
      return { ...baseStyle, backgroundColor: '#e74c3c', color: '#fff' };
    case 'cancelled':
      return { ...baseStyle, backgroundColor: '#95a5a6', color: '#fff' };
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
  filters: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  label: {
    fontWeight: '500',
    color: '#34495e'
  },
  select: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: '#34495e',
    color: '#fff',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid #ecf0f1'
  },
  td: {
    padding: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d'
  }
};

export default RequestReports;
