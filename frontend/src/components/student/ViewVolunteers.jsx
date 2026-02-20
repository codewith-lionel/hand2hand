import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', subject: '' });
  const [sortBy, setSortBy] = useState('completedExams');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [volunteers, sortBy]);

  const fetchVolunteers = async () => {
    try {
      const response = await studentAPI.getVolunteers({});
      setVolunteers(response.data.data);
      setFilteredVolunteers(response.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFiltersAndSort = () => {
    let filtered = [...volunteers].filter(v => v.userId); // Filter out volunteers with null userId
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'completedExams') {
        return b.completedExams - a.completedExams;
      } else if (sortBy === 'name') {
        return a.userId.name.localeCompare(b.userId.name);
      }
      return 0;
    });
    
    setFilteredVolunteers(filtered);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getVolunteers(filters);
      setVolunteers(response.data.data);
      setFilteredVolunteers(response.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ city: '', state: '', subject: '' });
    fetchVolunteers();
  };

  if (loading) {
    return <div className="loading">🔄 Loading volunteers...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        <h2 className="text-primary mb-4">🔍 Find Volunteers</h2>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              name="city"
              placeholder="🏙️ City"
              value={filters.city}
              onChange={handleFilterChange}
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <input
              type="text"
              name="state"
              placeholder="🗺️ State"
              value={filters.state}
              onChange={handleFilterChange}
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <input
              type="text"
              name="subject"
              placeholder="📚 Subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={handleSearch} className="btn btn-primary">
              🔎 Search
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline">
              ↺ Clear Filters
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                <option value="completedExams">Most Experienced</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-secondary" style={{ marginBottom: '1rem' }}>
          Found {filteredVolunteers.length} verified volunteer{filteredVolunteers.length !== 1 ? 's' : ''}
        </p>

        <div className="card-grid">
          {filteredVolunteers.length === 0 ? (
            <div className="card text-center" style={{ gridColumn: '1 / -1' }}>
              <p className="text-secondary">📭 No volunteers found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredVolunteers.map((volunteer) => (
              <div key={volunteer._id} className="card" style={{ position: 'relative' }}>
                {volunteer.completedExams >= 10 && (
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    ⭐ Top Volunteer
                  </span>
                )}
                <h3 className="text-primary">👤 {volunteer.userId?.name || 'N/A'}</h3>
                <p><strong>📧 Email:</strong> {volunteer.userId?.email || 'N/A'}</p>
                <p><strong>📞 Phone:</strong> {volunteer.userId?.phone || 'N/A'}</p>
                <p><strong>📍 Location:</strong> {volunteer.location.city}, {volunteer.location.state}</p>
                <p><strong>📚 Subjects:</strong> {volunteer.subjects.join(', ')}</p>
                <p><strong>🗣️ Languages:</strong> {volunteer.languages.join(', ')}</p>
                <p><strong>🎓 Education:</strong> {volunteer.education.degree} from {volunteer.education.institution}</p>
                <p><strong>✅ Completed Exams:</strong> <span className="badge badge-success">{volunteer.completedExams}</span></p>
                {volunteer.experience && (
                  <p><strong>💼 Experience:</strong> {volunteer.experience}</p>
                )}
                {volunteer.isVerified && <span className="badge badge-verified">✓ Verified</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVolunteers;
