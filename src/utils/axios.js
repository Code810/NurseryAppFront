// src/api/axios.js

import axios from 'axios';

export const api = () => {
 
  const token = localStorage.getItem('token'); 
  
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

