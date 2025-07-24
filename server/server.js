// server/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const connectDB = require('./config/db'); // Import DB connection function
const authRoutes = require('./routes/auth'); // Import authentication routes
const timeCapsuleRoutes = require('./routes/timeCapsule'); // Import time capsule routes
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const path = require('path'); // Node.js path module for file paths

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Body parser for JSON payloads, increased limit for large messages/base64 images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

// Define Routes
app.use('/api/auth', authRoutes); // Authentication routes will be prefixed with /api/auth
app.use('/api/timecapsules', timeCapsuleRoutes); // Time capsule routes will be prefixed with /api/timecapsules

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace to the console
    res.status(500).send('Something broke!'); // Send a generic 500 error response to the client
});

// Set port for the server
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));