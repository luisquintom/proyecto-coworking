import axios from 'axios';

// Vite carga las variables de entorno que empiezan por VITE_ a través de import.meta.env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
});

// Interceptor de peticiones: Aquí es donde pegamos el token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;