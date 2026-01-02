import axios from "axios";

// API layer barrel export
export * from './client';
export * from './types';
export * from './endpoints';
export * from './adapters';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;