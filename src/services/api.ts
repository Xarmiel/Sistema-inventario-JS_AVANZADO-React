import axios from 'axios';

// Instancia centralizada de Axios con configuración base según S14
export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de respuesta para manejo centralizado o diagnóstico si fuera necesario
api.interceptors.response.use(
  response => response,
  error => {
    // Proporcionar un mensaje de error legible
    const mensaje =
      error.response?.data?.message ||
      error.message ||
      'Error de comunicación con el servidor';
    return Promise.reject(new Error(mensaje));
  }
);

export default api;

