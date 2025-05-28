import axios from 'axios';

// Créez une instance Axios avec la base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Intercepteur de requête pour ajouter les cookies automatiquement
axiosInstance.interceptors.request.use(
   async (config) => {
    
    try {
/*       const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      } */
      return config;

    } catch (error) {
      console.error('Erreur lors de la récupération des cookies:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour logger les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Gérer l'expiration de la session ici si nécessaire
      console.error('Session expirée');
    }
    
    console.error('Erreur Axios:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;