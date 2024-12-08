import axios from 'axios';

// Créez une instance Axios avec la base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Remplacez par votre URL de base
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

export default axiosInstance;