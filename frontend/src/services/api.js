import axios from 'axios';

// Get the JWT token from localStorage
const token = localStorage.getItem('token');

// Axios instance with Authorization header
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default api;
