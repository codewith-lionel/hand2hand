import React, { useEffect, useState } from 'react';
import { volunteerAPI } from '../../services/api';

const AssignedExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [message, setMessage] = useState('');

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

  const handleCompleteExam = async (examId) => {
    if (!window.confirm('Mark this exam as completed?')) {
      return;
    }

    setCompleting(examId);
    try {
      await volunteerAPI.completeExam(examId);
      setMessage('✅ Exam marked as completed successfully!');
      fetchAssignedExams();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Error completing exam'));
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading your assigned exams...</div>;
  }

  const activeExams = exams.filter(e => e.status === 'accepted');
  const completedExams = exams.filter(e => e.status === 'completed');

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        <h2 className="text-primary mb-4">✅ My Assigned Exams</h2>
        
        {message && (
          <div className={message.includes('❌') ? 'alert alert-error' : 'alert alert-success'}>
            {message}
          </div>
        )}

        <h3 className="mt-3 mb-2">📝 Active Exams</h3>
        {activeExams.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">📭 No active exams at the moment.</p>
          </div>
        ) : (
          <div className="card-grid">
            {activeExams.map((exam) => (
              <div key={exam._id} className="request-card">
                <h4>📖 {exam.examDetails.subject}</h4>
                <p><strong>👤 Student:</strong> {exam.studentId.userId.name}</p>
                <p><strong>📧 Email:</strong> {exam.studentId.userId.email}</p>
                <p><strong>📞 Phone:</strong> {exam.studentId.userId.phone}</p>
                <p><strong>📅 Date:</strong> {new Date(exam.examDetails.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {exam.examDetails.time}</p>
                <p><strong>⏱️ Duration:</strong> {exam.examDetails.duration}</p>
                <p><strong>📝 Type:</strong> {exam.examDetails.type}</p>
                <p><strong>📍 Venue:</strong> {exam.examDetails.venue}</p>
                {exam.specialRequirements && (
                  <p><strong>⚠️ Special Requirements:</strong> {exam.specialRequirements}</p>
                )}
                <button
                  onClick={() => handleCompleteExam(exam._id)}
                  disabled={completing === exam._id}
                  className="btn btn-success"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  {completing === exam._id ? '⏳ Processing...' : '✅ Mark as Completed'}
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="mt-4 mb-2">🎯 Completed Exams</h3>
        {completedExams.length === 0 ? (
          <div className="card text-center">
            <p className="text-secondary">📭 No completed exams yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {completedExams.map((exam) => (
              <div key={exam._id} className="request-card" style={{ opacity: 0.8 }}>
                <h4>📖 {exam.examDetails.subject}</h4>
                <p><strong>👤 Student:</strong> {exam.studentId.userId.name}</p>
                <p><strong>📅 Date:</strong> {new Date(exam.examDetails.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {exam.examDetails.time}</p>
                <p><strong>📍 Venue:</strong> {exam.examDetails.venue}</p>
                <span className="badge badge-completed">✅ Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedExams;
