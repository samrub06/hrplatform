import { HRPlatformApi } from "@orensof/api-client";
const api = new HRPlatformApi({
  BASE: 'http://localhost:3000/api',
  WITH_CREDENTIALS: true,
  TOKEN: async () => localStorage.getItem('access_token') || '',
  HEADERS: {
    'Content-Type': 'application/json'
  }
});


export default api;