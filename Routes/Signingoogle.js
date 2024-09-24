const express = require('express');
const { OAuth2Client } = require('google-auth-library'); // Import the Google OAuth2 client
const dotenv = require('dotenv');

dotenv.config();


const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize the client with the environment variable

// Session middleware (consider adding this middleware if needed)
router.use(express.json()); // Ensure you can parse JSON request bodies

// Google sign-in endpoint
router.post('/', async (req, res) => {
  const { token } = req.body;
  console.log('Received token:', token);
  
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Use the environment variable
    });
    console.log('Verification ticket:', ticket);
    payload = ticket.getPayload();
    console.log('Payload:', payload);
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { email, name } = payload;
  console.log('Processing user:', name);

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: 'google', // Consider using a hashed password for security
          user_type: 'freelancer', // Set user type
        },
      });
      console.log('User created:', user);
    } else {
      console.log('User already exists:', user);
    }

    res.status(200).json({ message: 'User processed successfully', user }); // Return user info if needed
  } catch (error) {
    console.error('Error with Google sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
