import { HRPlatformApi } from "@orensof/api-client";
const api = new HRPlatformApi({
  BASE: process.env.REACT_APP_API_URL,
  WITH_CREDENTIALS: true,
  TOKEN: async () => localStorage.getItem('access_token') || '',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'

  }
});


export default api;