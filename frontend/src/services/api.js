import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Student API
export const studentAPI = {
  createProfile: (data) => api.post('/students/profile', data),
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getVolunteers: (params) => api.get('/students/volunteers', { params }),
  createRequest: (data) => api.post('/students/requests', data),
  getRequests: () => api.get('/students/requests')
};

// Volunteer API
export const volunteerAPI = {
  createProfile: (data) => api.post('/volunteers/profile', data),
  getProfile: () => api.get('/volunteers/profile'),
  updateProfile: (data) => api.put('/volunteers/profile', data),
  getRequests: () => api.get('/volunteers/requests'),
  respondToRequest: (id, data) => api.put(`/volunteers/requests/${id}/respond`, data),
  getAssignedExams: () => api.get('/volunteers/assigned-exams'),
  completeExam: (id) => api.put(`/volunteers/exams/${id}/complete`)
};

// Request API
export const requestAPI = {
  getRequests: () => api.get('/requests'),
  getRequest: (id) => api.get(`/requests/${id}`),
  cancelRequest: (id) => api.put(`/requests/${id}/cancel`)
};

export default api;
