import axios from 'axios';

const isLocalhost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const envApiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: isLocalhost
    ? 'http://localhost:5000/api'
    : envApiUrl
      ? `${envApiUrl}/api`
      : 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;