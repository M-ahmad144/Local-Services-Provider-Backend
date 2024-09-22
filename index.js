const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { parse } = require('pg-connection-string');
const cookieParser = require('cookie-parser')
const cors = require('cors')
dotenv.config();


const config = parse(process.env.DATABASE_URL);


config.ssl = {
  rejectUnauthorized: false,
};


const pool = new Pool(config);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    release();
  }
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


const port = process.env.PORT || 3000;

app.use(express.json());


// TEST CODE RUN THIS AND DONT REMOVE IT
app.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM playing_with_neon;');
    const users = result.rows;
    client.release();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
