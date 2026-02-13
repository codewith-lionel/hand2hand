import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
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
  login: (data) => adminApi.post('/auth/login', data),
  getMe: () => adminApi.get('/auth/me')
};

// Admin API
export const adminAPI = {
  getAllUsers: (params) => adminApi.get('/admin/users', { params }),
  verifyVolunteer: (id) => adminApi.put(`/admin/volunteers/${id}/verify`),
  getAllRequests: (params) => adminApi.get('/admin/requests', { params }),
  getStatistics: () => adminApi.get('/admin/statistics'),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`)
};

export default adminApi;
