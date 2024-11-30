// src/api.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/cadex/', // Base URL of your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');
      
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/cadex/token/refresh/', {
            refresh: refreshToken,
          });
          localStorage.setItem('access', response.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Optionally, redirect to login
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
