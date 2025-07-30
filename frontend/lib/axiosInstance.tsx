import axios from 'axios';
import { TokenService } from './services/tokenService';

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// Request interceptor to automatically add access token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if the request is for a public route
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      config.url?.includes(route)
    );
    
    // Skip token logic for public routes
    if (isPublicRoute) {
      return config;
    }
    
    try {
      const accessToken = await TokenService.getAccessToken();
      
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Create a separate axios instance for refresh to avoid interceptors
        const refreshAxios = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        // Try to refresh the access token using the separate instance
        const refreshResponse = await refreshAxios.post('/auth/refresh-token');

        const { accessToken } = refreshResponse.data;

        // Update the access token using the service
        await TokenService.setAccessToken(accessToken);

        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        console.error('Token refresh failed:', refreshError);
        
        // Clear all tokens using the service
        await TokenService.clearTokens();
        
        // Redirect to login page (client side only)
        if (typeof window !== 'undefined') {
          // Check if we're not already on login page to avoid infinite redirects
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Always reject errors for both client and server side
    // This ensures consistent error handling
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
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