import { message } from 'antd';
import axios from 'axios';

// Créez une instance Axios avec la base URL
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://hrplatform.onrender.com/api'
    : 'http://localhost:3000/api',
  withCredentials: true, // Important pour envoyer les cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Ajoutez un intercepteur pour inclure le token Bearer
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupérez le token du local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajoutez le token à l'en-tête Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Le refresh token est automatiquement envoyé dans les cookies
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        // Mettre à jour le token dans la requête originale
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Réessayer la requête originale avec le nouveau token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // En cas d'échec du refresh, déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres erreurs
    if (error.response) {
      const errorMessage = error.response.data.message || 'Une erreur est survenue';
      message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;