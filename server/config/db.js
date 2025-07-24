// server/config/db.js
const mongoose = require('mongoose'); // Import Mongoose library

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,    // Use new URL parser
            useUnifiedTopology: true, // Use new server discovery and monitoring engine
            // useCreateIndex: true, // Deprecated in Mongoose 6+
            // useFindAndModify: false // Deprecated in Mongoose 6+
        });
        console.log('MongoDB Connected...'); // Log success message
    } catch (err) {
        console.error(err.message); // Log any connection errors
        process.exit(1); // Exit the process with a failure code
    }
};

module.exports = connectDB; // Export the connection function