import React, { useEffect, useState } from 'react';
import { volunteerAPI } from '../../services/api';

const AssignedExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedExams();
  }, []);

  const fetchAssignedExams = async () => {
    try {
      const response = await volunteerAPI.getAssignedExams();
      setExams(response.data.data);
    } catch (error) {
      console.error('Error fetching assigned exams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Assigned Exams</h2>
      {exams.length === 0 ? (
        <p>No assigned exams at the moment.</p>
      ) : (
        <div style={styles.examList}>
          {exams.map((exam) => (
            <div key={exam._id} style={styles.examCard}>
              <h3>{exam.examDetails.subject}</h3>
              <p><strong>Student:</strong> {exam.studentId.userId.name}</p>
              <p><strong>Email:</strong> {exam.studentId.userId.email}</p>
              <p><strong>Phone:</strong> {exam.studentId.userId.phone}</p>
              <p><strong>Date:</strong> {new Date(exam.examDetails.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {exam.examDetails.time}</p>
              <p><strong>Duration:</strong> {exam.examDetails.duration}</p>
              <p><strong>Type:</strong> {exam.examDetails.type}</p>
              <p><strong>Venue:</strong> {exam.examDetails.venue}</p>
              {exam.specialRequirements && (
                <p><strong>Special Requirements:</strong> {exam.specialRequirements}</p>
              )}
              <p><strong>Status:</strong> <span style={getStatusStyle(exam.status)}>{exam.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  const baseStyle = { padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' };
  switch (status) {
    case 'accepted':
      return { ...baseStyle, backgroundColor: '#27ae60', color: '#fff' };
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
  examList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  examCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default AssignedExams;
