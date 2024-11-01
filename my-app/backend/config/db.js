const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;