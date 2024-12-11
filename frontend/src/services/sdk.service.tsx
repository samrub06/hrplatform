import { OpenAPI } from '@orensof/api-client-v2';

// Configuration de base
OpenAPI.BASE = 'http://localhost:3000/api';

// Si vous utilisez des tokens JWT
OpenAPI.TOKEN = async () => localStorage.getItem('access_token') || '';