const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose"); // Import mongoose module that will be used to connect to MongoDB.


const serviceProviderRouter = require('./Routes/ServiceProvider')

const { parse } = require('pg-connection-string');





dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/serviceProvider', serviceProviderRouter)
const port = process.env.PORT || 3000;

const monogURI = process.env.DATABASE_URL // Create a variable called mongoURI that will store the MongoDB connection string.

const connectDB = async () => { // Create a new function called connectDB that will connect to database.
  try {
    const connect = await mongoose.connect(monogURI); // Connect to MongoDB using mongoose.connect() method.
    console.log(`MongoDB Connected`); // If connection is successful, print the host name.
  } catch (err) { // If connection is unsuccessful, print the error message and exit the process.
    console.log(err); // Print the error message.
    process.exit(1); // Exit the process.
  }
};
app.get('/test', async (req, res) => {
  try {
    const users = await prisma.playingWithNeon.findMany(); 
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  connectDB()
  console.log(`Server running on http://localhost:${port}`);
});
