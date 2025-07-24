// client/src/services/timeCapsuleService.js
import axios from 'axios';

const API_URL = 'https://time-capsule-9mfd.onrender.com/api/timecapsules'; // <--- Explicitly add the backend host and port // Adjust port

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const createTimeCapsule = async (formData) => {
    // For file uploads, content-type needs to be 'multipart/form-data'
    // Axios automatically sets this when sending FormData
    const res = await axiosInstance.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const getTimeCapsules = async () => {
    const res = await axiosInstance.get('/');
    return res.data;
};

export const getTimeCapsuleById = async (id) => {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
};

export const deleteTimeCapsule = async (id) => {
    const res = await axiosInstance.delete(`/${id}`);
    return res.data;
};
