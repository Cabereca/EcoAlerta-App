import storage from '@/storage/init';
import axios, { AxiosHeaderValue, HeadersDefaults } from 'axios';

type headers = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
  [key: string]: AxiosHeaderValue;
};

const api = axios.create();

api.defaults.baseURL = process.env.API_URL || 'http://10.0.2.2:3000';

api.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as headers & HeadersDefaults;

// Adding Authorization header for all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.load({key: 'token'});
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(error);
    } finally {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
