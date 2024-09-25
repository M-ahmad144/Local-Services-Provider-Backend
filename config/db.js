// db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.DATABASE_URL; // Connection string from environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI); // Connect to MongoDB without deprecated options
    console.log("connected to MongoDB");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
