import { api } from './api';

const buildAuthHeaders = () => {
  const token = localStorage.getItem('esg_access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
};

const toError = (error, fallbackMessage = 'Request failed') => {
  const message = error?.displayMessage || error?.response?.data?.message || error?.message || fallbackMessage;
  const wrappedError = new Error(error?.silent ? '' : message);
  wrappedError.displayMessage = message;
  wrappedError.silent = Boolean(error?.silent);
  wrappedError.status = error?.response?.status;
  wrappedError.response = error?.response;
  return wrappedError;
};

export const assessmentApi = {
  fetchMaterialTopics: async (params) => {
    try {
      const response = await api.get('/assessment-flow/material-topics', { ...buildAuthHeaders(), params });
      return response;
    } catch (error) {
      throw toError(error, 'Unable to load material topics.');
    }
  },

  startAssessment: async (selectedTopicIds) => {
    try {
      const response = await api.post('/assessment-flow/start', { selectedTopicIds }, buildAuthHeaders());
      return response.data;
    } catch (error) {
      throw toError(error, 'Unable to start the assessment.');
    }
  },

  submitAssessment: async (payload) => {
    try {
      const response = await api.post('/assessment-flow/submit', payload, buildAuthHeaders());
      return response.data;
    } catch (error) {
      throw toError(error, 'Unable to submit the assessment.');
    }
  },

  fetchDashboardAnalytics: async () => {
    try {
      const response = await api.get('/assessment-flow/analytics', buildAuthHeaders());
      return response.data;
    } catch (error) {
      throw toError(error, 'Unable to load analytics.');
    }
  },

  downloadPdfReport: async () => {
    try {
      const response = await api.get('/assessment-flow/report', {
        ...buildAuthHeaders(),
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw toError(error, 'Unable to download the report.');
    }
  },
};
