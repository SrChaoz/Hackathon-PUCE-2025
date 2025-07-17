import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las requests
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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Songs API
export const songsAPI = {
  // Obtener todas las canciones con filtros
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await api.get(`/songs?${params.toString()}`);
    return response.data;
  },
  
  // Obtener canción por ID
  getById: async (id) => {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  },
  
  // Crear nueva canción
  create: async (songData) => {
    const response = await api.post('/songs', songData);
    return response.data;
  },
  
  // Actualizar canción
  update: async (id, songData) => {
    const response = await api.put(`/songs/${id}`, songData);
    return response.data;
  },
  
  // Eliminar canción
  delete: async (id) => {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  },
  
  // Obtener géneros disponibles
  getGenres: async () => {
    const response = await api.get('/songs/genres');
    return response.data;
  },
  
  // Obtener artistas disponibles
  getArtists: async () => {
    const response = await api.get('/songs/artists');
    return response.data;
  },
  
  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/songs/stats');
    return response.data;
  }
};

export default api;
