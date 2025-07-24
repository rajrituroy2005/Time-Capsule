import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateCapsulePage from './pages/CreateCapsulePage';
import ViewCapsulePage from './pages/ViewCapsulePage';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

import './styles/main.scss'; 

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/create" element={<PrivateRoute><CreateCapsulePage /></PrivateRoute>} />
                        <Route path="/capsule/:id" element={<PrivateRoute><ViewCapsulePage /></PrivateRoute>} />
                    </Routes>
                </main>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
