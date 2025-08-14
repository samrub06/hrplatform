import axios from 'axios';

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // allow cookies
});

// Simple response interceptor for error logging
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log errors for debugging
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    } else if (error.response?.status === 401) {
      console.error('Unauthorized:', error.response.data);
    } else {
      console.error('Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;