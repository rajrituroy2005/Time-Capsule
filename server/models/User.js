// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures unique usernames
        trim: true    // Removes whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures unique emails
        match: [/.+@.+\..+/, 'Please use a valid email address'] // Basic email regex validation
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets default value to the current date/time
    }
});

// Mongoose pre-save hook to hash password before saving to the database
UserSchema.pre('save', async function (next) {
    // Only hash if the password field is modified or it's a new user
    if (!this.isModified('password')) {
        next(); // Move to the next middleware or save operation
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Returns true if passwords match
};

module.exports = mongoose.model('User', UserSchema); // Export the User model