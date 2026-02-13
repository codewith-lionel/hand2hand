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
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{profile ? 'Update' : 'Create'} Volunteer Profile</h2>
      {message && (
        <div style={message.includes('Error') ? styles.error : styles.success}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>Education</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Degree</label>
          <input
            type="text"
            name="education.degree"
            value={formData.education.degree}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Institution</label>
          <input
            type="text"
            name="education.institution"
            value={formData.education.institution}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Graduation Year</label>
          <input
            type="number"
            name="education.year"
            value={formData.education.year}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <h3>Subjects</h3>
        <div style={styles.arrayInput}>
          <input
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Add a subject"
            style={styles.input}
          />
          <button type="button" onClick={addSubject} style={styles.addButton}>
            Add
          </button>
        </div>
        <div style={styles.tags}>
          {formData.subjects.map((subject, index) => (
            <span key={index} style={styles.tag}>
              {subject}
              <button type="button" onClick={() => removeSubject(subject)} style={styles.removeTag}>
                ×
              </button>
            </span>
          ))}
        </div>

        <h3>Languages</h3>
        <div style={styles.arrayInput}>
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Add a language"
            style={styles.input}
          />
          <button type="button" onClick={addLanguage} style={styles.addButton}>
            Add
          </button>
        </div>
        <div style={styles.tags}>
          {formData.languages.map((language, index) => (
            <span key={index} style={styles.tag}>
              {language}
              <button type="button" onClick={() => removeLanguage(language)} style={styles.removeTag}>
                ×
              </button>
            </span>
          ))}
        </div>

        <h3>Location</h3>
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode</label>
            <input
              type="text"
              name="location.pincode"
              value={formData.location.pincode}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Experience (Optional)</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          />
        </div>

        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem',
    flex: 1
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  arrayInput: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  tag: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  removeTag: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  success: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem'
  }
};

export default VolunteerProfile;
