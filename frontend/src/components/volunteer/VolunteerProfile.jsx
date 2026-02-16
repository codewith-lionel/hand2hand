import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerAPI } from '../../services/api';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    education: {
      degree: '',
      institution: '',
      year: new Date().getFullYear()
    },
    subjects: [],
    languages: [],
    location: {
      city: '',
      state: '',
      pincode: ''
    },
    experience: ''
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await volunteerAPI.getProfile();
      setProfile(response.data.data);
      setFormData({
        education: response.data.data.education,
        subjects: response.data.data.subjects,
        languages: response.data.data.languages,
        location: response.data.data.location,
        experience: response.data.data.experience || ''
      });
    } catch (error) {
      console.log('No profile found, create one');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSubject = () => {
    if (subjectInput && !formData.subjects.includes(subjectInput)) {
      setFormData({ ...formData, subjects: [...formData.subjects, subjectInput] });
      setSubjectInput('');
    }
  };

  const removeSubject = (subject) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subject)
    });
  };

  const addLanguage = () => {
    if (languageInput && !formData.languages.includes(languageInput)) {
      setFormData({ ...formData, languages: [...formData.languages, languageInput] });
      setLanguageInput('');
    }
  };

  const removeLanguage = (language) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== language)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profile) {
        await volunteerAPI.updateProfile(formData);
        setMessage('Profile updated successfully!');
      } else {
        await volunteerAPI.createProfile(formData);
        setMessage('Profile created successfully!');
        navigate('/volunteer/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">🔄 Loading profile...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="form-title">{profile ? '✏️ Update' : '✨ Create'} Volunteer Profile</h2>
        {message && (
          <div className={message.includes('Error') ? 'alert alert-error' : 'alert alert-success'}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <h3 className="text-primary mt-3 mb-2">🎓 Education</h3>
          <div className="form-group">
            <label className="form-label">Degree</label>
            <input
              type="text"
              name="education.degree"
              value={formData.education.degree}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., B.Sc. Computer Science"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input
              type="text"
              name="education.institution"
              value={formData.education.institution}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your institution name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Graduation Year</label>
            <input
              type="number"
              name="education.year"
              value={formData.education.year}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <h3 className="text-primary mt-4 mb-2">📚 Subjects</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Add a subject (e.g., Mathematics, Physics)"
              className="form-input"
            />
            <button type="button" onClick={addSubject} className="btn btn-success" style={{ whiteSpace: 'nowrap' }}>
              ➕ Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {formData.subjects.map((subject, index) => (
              <span key={index} className="badge badge-accepted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {subject}
                <button type="button" onClick={() => removeSubject(subject)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <h3 className="text-primary mt-4 mb-2">🗣️ Languages</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="Add a language (e.g., English, Hindi)"
              className="form-input"
            />
            <button type="button" onClick={addLanguage} className="btn btn-success" style={{ whiteSpace: 'nowrap' }}>
              ➕ Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {formData.languages.map((language, index) => (
              <span key={index} className="badge badge-completed" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {language}
                <button type="button" onClick={() => removeLanguage(language)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <h3 className="text-primary mt-4 mb-2">📍 Location</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your city"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your state"
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Pincode"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Experience (Optional)</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Describe your volunteer experience or teaching background"
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-full">
            {saving ? '💾 Saving...' : profile ? '✅ Update Profile' : '✨ Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerProfile;
