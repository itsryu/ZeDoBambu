import axios from 'axios';
import { auth } from './firebase';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('[Axios Interceptor] Erro ao obter o token de ID:', error);
      }
    }

    return config;
  },
  (error) => {
    console.error('[Axios Interceptor] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export default apiClient;