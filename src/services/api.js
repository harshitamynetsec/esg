import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('esg_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    const wrappedError = new Error(message);
    wrappedError.status = error.response?.status;
    wrappedError.response = error.response;
    return Promise.reject(wrappedError);
  },
);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
};

export const dashboardApi = {
  dashboard: () => api.get('/dashboard'),
  analytics: () => api.get('/dashboard/analytics'),
};

export const resourceApi = (resource) => ({
  list: (params) => api.get(`/${resource}`, { params }),
  get: (id) => api.get(`/${resource}/${id}`),
  create: (payload) => api.post(`/${resource}`, payload),
  update: (id, payload) => api.put(`/${resource}/${id}`, payload),
  remove: (id) => api.delete(`/${resource}/${id}`),
});

export const reportApi = {
  list: () => api.get('/reports'),
  generate: (payload) => api.post('/reports/generate', payload),
};

export const questionnaireApi = {
  get: (type = 'compass') => api.get('/questionnaire', { params: { type } }),
  submit: (payload) => api.post('/questionnaire', payload),
};
