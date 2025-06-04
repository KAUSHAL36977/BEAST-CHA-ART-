import axios from 'axios';
import { setupAPIErrorInterceptor, retryOperation } from '../utils/errorHandling';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup error interceptor
setupAPIErrorInterceptor(api);

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Wrap API calls with retry logic
const withRetry = (apiCall) => {
  return retryOperation(apiCall);
};

// Auth services
export const auth = {
  register: (userData) => withRetry(() => api.post('/auth/register', userData)),
  login: (credentials) => withRetry(() => api.post('/auth/login', credentials)),
};

// Workspace services
export const workspaces = {
  create: (workspaceData) => withRetry(() => api.post('/workspaces', workspaceData)),
  getAll: () => withRetry(() => api.get('/workspaces')),
  getOne: (id) => withRetry(() => api.get(`/workspaces/${id}`)),
  update: (id, data) => withRetry(() => api.patch(`/workspaces/${id}`, data)),
  delete: (id) => withRetry(() => api.delete(`/workspaces/${id}`)),
};

// Page services
export const pages = {
  create: (pageData) => withRetry(() => api.post('/pages', pageData)),
  getAll: () => withRetry(() => api.get('/pages')),
  getOne: (id) => withRetry(() => api.get(`/pages/${id}`)),
  update: (id, data) => withRetry(() => api.patch(`/pages/${id}`, data)),
  delete: (id) => withRetry(() => api.delete(`/pages/${id}`)),
};

// Block services
export const blocks = {
  create: (blockData) => withRetry(() => api.post('/blocks', blockData)),
  update: (id, data) => withRetry(() => api.patch(`/blocks/${id}`, data)),
  delete: (id) => withRetry(() => api.delete(`/blocks/${id}`)),
};

// Comment services
export const comments = {
  create: (commentData) => withRetry(() => api.post('/comments', commentData)),
  getAll: (pageId) => withRetry(() => api.get(`/comments?pageId=${pageId}`)),
  update: (id, data) => withRetry(() => api.patch(`/comments/${id}`, data)),
  delete: (id) => withRetry(() => api.delete(`/comments/${id}`)),
};

// Notification services
export const notifications = {
  getAll: () => withRetry(() => api.get('/notifications')),
  markAsRead: (id) => withRetry(() => api.patch(`/notifications/${id}`, { isRead: true })),
};

export default api; 