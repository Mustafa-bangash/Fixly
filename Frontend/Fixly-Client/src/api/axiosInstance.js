import axios from 'axios';

// Axios instance configured for Fixly backend API
// withCredentials is required because the backend stores JWT in an httpOnly cookie
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
