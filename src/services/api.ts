import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    const mensaje =
      error.response?.data?.message ||
      error.message ||
      'Error de comunicación con el servidor';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;

