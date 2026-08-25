import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://esg-7uft.onrender.com/api';
const AUTH_STORAGE_KEYS = ['esg_access_token', 'esg_refresh_token', 'esg_user'];
let sessionExpiryHandled = false;
const responseCache = new Map();

export const getCachedResponse = (key) => {
  const cached = responseCache.get(key);
  return cached?.data || null;
};

export const setCachedResponse = (key, data) => {
  responseCache.set(key, { data, timestamp: Date.now() });
};

const notify = (detail) => {
  window.dispatchEvent(new CustomEvent('esg:notification', { detail }));
};

const clearStoredSession = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent('esg:session-expired'));
};

const isAuthEndpoint = (url = '') => url.includes('/auth/login') || url.includes('/auth/register');

const isExpiredSession = (error) => {
  const status = error.response?.status;
  const code = error.response?.data?.code;
  const hadToken = Boolean(error.config?.headers?.Authorization || localStorage.getItem('esg_access_token'));

  return status === 401 && hadToken && !isAuthEndpoint(error.config?.url) && (
    code === 'SESSION_EXPIRED'
    || code === 'TokenExpiredError'
    || code === 'JsonWebTokenError'
    || code === 'AUTH_INVALID_USER'
    || code === 'AUTH_REQUIRED'
  );
};

const buildApiError = (error, message, options = {}) => {
  const wrappedError = new Error(options.silent ? '' : message);
  wrappedError.displayMessage = message;
  wrappedError.silent = Boolean(options.silent);
  wrappedError.status = error.response?.status;
  wrappedError.response = error.response;
  return wrappedError;
};

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
    if (isExpiredSession(error)) {
      if (!sessionExpiryHandled) {
        sessionExpiryHandled = true;
        clearStoredSession();
        const message = 'Your session has expired. Please sign in again.';
        notify({ type: 'info', title: 'Session expired', message });
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
      const message = 'Your session has expired. Please sign in again.';
      return Promise.reject(buildApiError(error, message, { silent: true }));
    }

    const status = error.response?.status;
    const fallback = status === 403
      ? 'You do not have access to perform that action.'
      : 'Something went wrong. Please try again.';
    const message = error.response?.data?.message || error.message || fallback;

    notify({
      type: status === 403 ? 'warning' : 'error',
      title: status === 403 ? 'Action not allowed' : 'Request failed',
      message: status === 403 ? 'You do not have access to perform that action.' : message,
    });

    return Promise.reject(buildApiError(error, message, { silent: true }));
  },
);

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  setPassword: (payload) => api.post('/auth/set-password', payload),
};

export const teamApi = {
  list: () => api.get('/team'),
  invite: (payload) => api.post('/team/invite', payload),
  update: (id, payload) => api.patch(`/team/${id}`, payload),
  updateStatus: (id, payload) => api.patch(`/team/${id}/status`, payload),
  resendInvite: (id) => api.post(`/team/${id}/resend-invite`),
};

export const dashboardApi = {
  dashboard: () => api.get('/dashboard'),
  dashboardCached: () => api.get('/dashboard').then((response) => {
    setCachedResponse('dashboard', response);
    return response;
  }),
  analytics: () => api.get('/dashboard/analytics'),
};

export const resourceApi = (resource) => ({
  list: (params) => api.get(`/${resource}`, { params }),
  listCached: (params) => {
    const key = `${resource}:${JSON.stringify(params || {})}`;
    return api.get(`/${resource}`, { params }).then((response) => {
      setCachedResponse(key, response);
      return response;
    });
  },
  get: (id) => api.get(`/${resource}/${id}`),
  create: (payload) => api.post(`/${resource}`, payload),
  activate: (id) => api.post(`/${resource}/${id}/activate`),
  update: (id, payload) => api.put(`/${resource}/${id}`, payload),
  remove: (id) => api.delete(`/${resource}/${id}`),
});

export const getResourceCacheKey = (resource, params) => `${resource}:${JSON.stringify(params || {})}`;

export const objectiveApi = {
  ...resourceApi('objectives'),
  quickAdd: (payload) => api.post('/objectives/quick-add', payload),
};

export const kpiApi = {
  ...resourceApi('kpis'),
  quickAdd: (payload) => api.post('/kpis/quick-add', payload),
};

export const reportApi = {
  list: () => api.get('/reports'),
  generate: (payload) => api.post('/reports/generate', payload),
};

export const learningApi = {
  hub: () => api.get('/learning/hub'),
  hubCached: () => api.get('/learning/hub').then((response) => {
    setCachedResponse('learning:hub', response);
    return response;
  }),
  updateProgress: (payload) => api.post('/learning/progress', payload),
};

export const demoRequestApi = {
  submit: (payload) => api.post('/demo-requests', payload),
  list: (params) => api.get('/demo-requests', { params }),
  updateStatus: (id, status) => api.patch(`/demo-requests/${id}/status`, { status }),
};

export const questionnaireApi = {
  get: (type = 'compass') => api.get('/questionnaire', { params: { type } }),
  submit: (payload) => api.post('/questionnaire', payload),
};
