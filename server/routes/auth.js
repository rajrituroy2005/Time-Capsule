// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For creating JWTs
const { check, validationResult } = require('express-validator'); // For input validation
const User = require('../models/User'); // Import the User model
const auth = require('../middleware/auth'); // Import auth middleware to protect routes

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    [
        // Input validation using express-validator
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors
        }

        const { username, email, password } = req.body; // Destructure request body

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            // Create a new user instance
            user = new User({
                username,
                email,
                password, // Password will be hashed by pre-save hook in User model
            });

            await user.save(); // Save the user to the database

            // Create JWT payload
            const payload = {
                user: {
                    id: user.id, // Mongoose virtual ID for _id
                },
            };

            // Sign the JWT
            jwt.sign(
                payload,
                process.env.JWT_SECRET, // Secret from environment variables
                { expiresIn: '1h' }, // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err; // Handle JWT signing error
                    res.json({ token }); // Respond with the token
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error'); // Generic server error
        }
    }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        // Input validation for login
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' }); // Generic message for security
            }

            // Compare entered password with hashed password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            // Create JWT payload
            const payload = {
                user: {
                    id: user.id,
                },
            };

            // Sign the JWT
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   GET api/auth/user
// @desc    Get logged in user data
// @access  Private (protected by auth middleware)
router.get('/user', auth, async (req, res) => {
    try {
        // Find user by ID from the token, exclude password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user); // Respond with user data
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; // Export the router