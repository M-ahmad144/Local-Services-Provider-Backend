const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');


const serviceProviderRouter = require('./Routes/ServiceProvider')

const { parse } = require('pg-connection-string');





dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(serviceProviderRouter);

const port = process.env.PORT || 3000;

// Connect to the database
async function config() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if connection fails
  }
}

app.get('/test', async (req, res) => {
  try {
    const users = await prisma.playingWithNeon.findMany(); 
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

config();
