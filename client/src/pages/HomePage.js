// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Unlock Your Future Memories.</h1>
                <p>Create digital time capsules with messages, photos, and notes, and set a future date to reveal them.</p>
                {!isAuthenticated ? (
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
                    </div>
                ) : (
                    <div className="hero-actions">
                        <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
                    </div>
                )}
            </div>

            <section className="features-section">
                <h2>Why Create a Time Capsule?</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <h3>Personal Journey</h3>
                        <p>Reflect on your past self, memories, and aspirations.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Secure & Private</h3>
                        <p>Your memories are stored securely until the designated unlock date.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Future Self Connection</h3>
                        <p>Send messages, photos, and thoughts to your future self.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Start Your Journey Through Time?</h2>
                {!isAuthenticated && (
                    <Link to="/register" className="btn btn-primary btn-lg">Create Your First Capsule Now</Link>
                )}
            </section>
        </div>
    );
};

export default HomePage;