// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, getCurrentUser } from '../services/authService';
import axios from 'axios'; // <-- ADD THIS LINE BACK IN!

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Set axios default header BEFORE calling getCurrentUser
                axios.defaults.headers.common['x-auth-token'] = token; // This line needs axios
                try {
                    const res = await getCurrentUser();
                    setUser(res);
                } catch (err) {
                    console.error('Error loading user:', err);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['x-auth-token']; // This line needs axios
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (formData) => {
        try {
            const res = await registerUser(formData);
            localStorage.setItem('token', res.token);
            axios.defaults.headers.common['x-auth-token'] = res.token; // This line needs axios
            const userRes = await getCurrentUser();
            setUser(userRes);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            throw err;
        }
    };

    const login = async (formData) => {
        try {
            const res = await loginUser(formData);
            localStorage.setItem('token', res.token);
            axios.defaults.headers.common['x-auth-token'] = res.token; // This line needs axios
            const userRes = await getCurrentUser();
            setUser(userRes);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token']; // This line needs axios
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};