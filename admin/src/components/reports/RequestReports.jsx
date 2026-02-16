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
    return <div className="admin-loading">🔄 Loading reports...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper admin-fade-in">
        <h2 className="admin-text-primary admin-mb-4">📊 Request Reports</h2>

        <div className="admin-filter-section">
          <label className="admin-filter-label">🔍 Filter by Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="admin-select"
          >
            <option value="">All Requests</option>
            <option value="pending">⏳ Pending</option>
            <option value="accepted">✅ Accepted</option>
            <option value="completed">🎯 Completed</option>
            <option value="rejected">❌ Rejected</option>
            <option value="cancelled">🚫 Cancelled</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>📚 Subject</th>
                <th>🎓 Student</th>
                <th>🤝 Volunteer</th>
                <th>📅 Date</th>
                <th>⏰ Time</th>
                <th>🏫 Venue</th>
                <th>📊 Status</th>
                <th>📝 Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.examDetails.subject}</td>
                  <td>{request.studentId?.userId?.name || 'N/A'}</td>
                  <td>{request.volunteerId?.userId?.name || 'Unassigned'}</td>
                  <td>{new Date(request.examDetails.date).toLocaleDateString()}</td>
                  <td>{request.examDetails.time}</td>
                  <td>{request.examDetails.venue}</td>
                  <td>
                    <span className={`admin-badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <p className="admin-no-data">😕 No requests found.</p>
        )}
      </div>
    </div>
  );
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'success';
    case 'completed':
      return 'info';
    case 'rejected':
      return 'danger';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

export default RequestReports;
