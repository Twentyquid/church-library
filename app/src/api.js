// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // Adjust to your server URL
  timeout: 5000,
});

export default api;
