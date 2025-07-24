// client/src/components/Auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Get the login function from AuthContext

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login({ email, password });
            // Redirect is handled by AuthContext now
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.msg || 'Invalid Credentials'); // Display error message from backend
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Login to Your Time Capsule</h2>
            <form onSubmit={onSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="6"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <p className="auth-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;