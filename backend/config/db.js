const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return; // Prevent multiple connections in serverless environments
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://akshvt:1234@cluster0.aqxp3ex.mongodb.net/moviestream');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    // Removed process.exit(1) because it kills Vercel serverless functions abruptly and causes generic 500 errors
  }
};

module.exports = connectDB;
