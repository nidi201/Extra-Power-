import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If explicitly set, use it
  if (envUrl) {
    return envUrl;
  }
  
  // Production fallback - your Render server URL
  if (import.meta.env.PROD) {
    return "https://extra-power-cleanpro.onrender.com";
  }
  
  // Default to empty (works with Vite proxy in dev)
  return "";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Cannot connect to server. Make sure VITE_API_URL is configured in production.');
    }
    return Promise.reject(error);
  }
);

export default api;

