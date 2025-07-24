// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'https://time-capsule-9mfd.onrender.com/api/auth'; // <-- THIS MUST BE 'http://localhost:5000/api/auth'

export const registerUser = async (userData) => {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
};

export const loginUser = async (userData) => {
    const res = await axios.post(`${API_URL}/login`, userData);
    return res.data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
        return null;
    }
    const res = await axios.get(`${API_URL}/user`); // <-- Using API_URL
    return res.data;
};
