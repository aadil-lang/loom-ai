import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // For refresh token cookies if used, though we'll use localStorage fallback for now
});

// Request Interceptor: Attach JWT
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s & Auto-Refresh
api.interceptors.response.use(
  (response) => response.data, // Strip axios wrapper and return exactly what backend sends { success, data, message }
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            // No refresh token -> force logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
            return Promise.reject(error);
          }

          // Attempt to refresh
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          
          if (res.data?.data?.accessToken) {
            // Save new tokens
            localStorage.setItem('token', res.data.data.accessToken);
            localStorage.setItem('refreshToken', res.data.data.refreshToken);
            
            // Update original request headers and retry
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed -> force logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;
