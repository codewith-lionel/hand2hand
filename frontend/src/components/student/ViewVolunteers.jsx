import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', subject: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await studentAPI.getVolunteers(filters);
      setVolunteers(response.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setLoading(true);
    fetchVolunteers();
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Find Volunteers</h2>
      
      <div style={styles.filters}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
          style={styles.input}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={filters.state}
          onChange={handleFilterChange}
          style={styles.input}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleFilterChange}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      <div style={styles.volunteerList}>
        {volunteers.length === 0 ? (
          <p>No volunteers found. Try adjusting your filters.</p>
        ) : (
          volunteers.map((volunteer) => (
            <div key={volunteer._id} style={styles.volunteerCard}>
              <h3>{volunteer.userId.name}</h3>
              <p><strong>Email:</strong> {volunteer.userId.email}</p>
              <p><strong>Phone:</strong> {volunteer.userId.phone}</p>
              <p><strong>Location:</strong> {volunteer.location.city}, {volunteer.location.state}</p>
              <p><strong>Subjects:</strong> {volunteer.subjects.join(', ')}</p>
              <p><strong>Languages:</strong> {volunteer.languages.join(', ')}</p>
              <p><strong>Education:</strong> {volunteer.education.degree} from {volunteer.education.institution}</p>
              <p><strong>Completed Exams:</strong> {volunteer.completedExams}</p>
              {volunteer.isVerified && <span style={styles.verified}>✓ Verified</span>}
            </div>
          ))
        )}
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
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  volunteerList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  volunteerCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  verified: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default ViewVolunteers;
