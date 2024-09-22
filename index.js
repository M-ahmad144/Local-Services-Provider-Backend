const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { parse } = require('pg-connection-string');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const cors = require('cors'); // Ensure cors is imported if needed

dotenv.config();

// Parse the DATABASE_URL and configure SSL
const config = parse(process.env.DATABASE_URL);

config.ssl = {
  rejectUnauthorized: false,
};

// Create a PostgreSQL connection pool
const pool = new Pool(config);

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    release();
  }
});

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing
app.use(cors()); // Enable CORS if needed

const port = process.env.PORT || 3000;

// Test endpoint to fetch data from the database
app.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM playing_with_neon;');
    const users = result.rows;
    client.release();
    res.json(users); // Send the data as JSON
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
