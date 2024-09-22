const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();


const router = express.Router();

// Session middleware
router.post('/', async (req, res) => {
    const { token } = req.body;
  
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    const { email, name } = payload;
    console.log('first step');
  
    try {
      let user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            password: 'google',
           
            user_type: 'freelancer', // Add this line
          },
        });
      }
  
      res.status(200).json({message: 'User created successfully'});
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
 
 
  


module.exports = router;
