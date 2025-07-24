// server/routes/timeCapsule.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Auth middleware
const TimeCapsule = require('../models/TimeCapsule'); // TimeCapsule model
const multer = require('multer'); // For handling file uploads
const path = require('path'); // For path manipulation
const fs = require('fs'); // Node.js file system module for deleting files

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads'); // Define upload directory
        // Create the 'uploads' directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); // Set destination
    },
    filename: (req, file, cb) => {
        // Define file name (timestamp-originalfilename) to prevent collisions
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit per file
});

// @route   POST api/timecapsules
// @desc    Create a time capsule
// @access  Private
// Uses upload.array('files', 5) to handle multiple file uploads (up to 5)
router.post('/', auth, upload.array('files', 5), async (req, res) => {
    try {
        const { title, message, unlockDate } = req.body;
        // Map uploaded files to an array with filename, filepath, and mimetype
        const files = req.files ? req.files.map(file => ({
            filename: file.filename,
            filepath: `/uploads/${file.filename}`, // Store public path for serving
            mimetype: file.mimetype
        })) : [];

        // Create new TimeCapsule instance
        const newTimeCapsule = new TimeCapsule({
            userId: req.user.id, // User ID from authenticated token
            title,
            message,
            files,
            unlockDate: new Date(unlockDate), // Convert unlockDate to Date object
        });

        const timeCapsule = await newTimeCapsule.save(); // Save to database
        res.json(timeCapsule); // Respond with the created capsule
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/timecapsules
// @desc    Get all time capsules for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find all capsules belonging to the user, sorted by unlock date
        const timeCapsules = await TimeCapsule.find({ userId: req.user.id }).sort({ unlockDate: 1 });
        res.json(timeCapsules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/timecapsules/:id
// @desc    Get a single time capsule by ID (only if unlocked or current user)
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const capsule = await TimeCapsule.findById(req.params.id); // Find capsule by ID

        if (!capsule) {
            return res.status(404).json({ msg: 'Time Capsule not found' });
        }

        // Logic to restrict access:
        // User can access if:
        // 1. They are the owner of the capsule OR
        // 2. The current date is past the unlockDate
        const now = new Date();
        const isOwner = capsule.userId.toString() === req.user.id;
        const isPastUnlockDate = now >= capsule.unlockDate;

        if (!isOwner && !isPastUnlockDate) {
            return res.status(403).json({ msg: 'Access denied: Capsule is locked and you are not the owner.' });
        }

        // If it's past the unlock date but not yet marked as unlocked, update it
        if (!capsule.isUnlocked && isPastUnlockDate) {
            capsule.isUnlocked = true;
            await capsule.save(); // Save the updated status
        }

        res.json(capsule); // Respond with capsule data
    } catch (err) {
        console.error(err.message);
        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Time Capsule not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/timecapsules/:id
// @desc    Delete a time capsule
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const capsule = await TimeCapsule.findById(req.params.id);

        if (!capsule) {
            return res.status(404).json({ msg: 'Time Capsule not found' });
        }

        // Ensure user owns the capsule before deleting
        if (capsule.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this capsule' });
        }

        // Delete associated files from the server's 'uploads' directory
        capsule.files.forEach(file => {
            // Construct the absolute file path
            const filePath = path.join(__dirname, '../', file.filepath); // Go up one level from routes, then into uploads
            if (fs.existsSync(filePath)) { // Check if file exists before trying to delete
                fs.unlink(filePath, (err) => { // Asynchronously delete the file
                    if (err) console.error(`Failed to delete file: ${filePath}`, err);
                });
            }
        });

        await capsule.deleteOne(); // Delete the capsule from the database (Mongoose 6+)

        res.json({ msg: 'Time Capsule removed successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Time Capsule not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; // Export the router