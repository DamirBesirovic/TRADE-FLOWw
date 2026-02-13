import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Nemate dozvolu za ovu akciju');
    } else if (error.response?.status === 403) {
      toast.error('Pristup zabranjen');
    } else if (error.response?.status >= 500) {
      toast.error('Greška na serveru');
    }
    return Promise.reject(error);
  }
);

export default api;