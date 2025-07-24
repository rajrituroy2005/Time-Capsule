// server/models/TimeCapsule.js
const mongoose = require('mongoose');

const TimeCapsuleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: false, // Message can be optional if only images are uploaded
        trim: true
    },
    files: [ // Array to store information about uploaded files
        {
            filename: String,
            filepath: String, // Publicly accessible path to the uploaded file
            mimetype: String  // MIME type of the file (e.g., 'image/jpeg')
        }
    ],
    unlockDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isUnlocked: { // Flag to track if the capsule has been 'unlocked' (i.e., its unlockDate is in the past)
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('TimeCapsule', TimeCapsuleSchema); // Export the TimeCapsule model