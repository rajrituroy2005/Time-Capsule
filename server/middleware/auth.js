// server/middleware/auth.js
const jwt = require('jsonwebtoken'); // Import JWT library

module.exports = function (req, res, next) {
    // Get token from the 'x-auth-token' header
    const token = req.header('x-auth-token');

    // Check if no token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify the token
    try {
        // Verify the token using the secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user payload to the request object
        req.user = decoded.user;
        next(); // Move to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' }); // Send 401 if token is invalid
    }
};