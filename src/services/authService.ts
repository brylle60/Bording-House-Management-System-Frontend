import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000, // Timeout after 5 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginUser = async (credentials: any) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    // This will tell you if the error is a Backend issue or a Browser issue
    console.error("API Error Detail:", error.response?.data || error.message);
    throw error;
  }
};