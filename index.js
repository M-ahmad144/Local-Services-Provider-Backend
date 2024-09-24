const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const serviceProviderRouter = require('./Routes/ServiceProvider')
const signingoogle = require('./Routes/Signingoogle')
const profileRouter = require('./Routes/Profile')
const User=require('./Routes/User')

// signin with google
const {OAuth2Client} = require('google-auth-library');

dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/serviceProvider', serviceProviderRouter)
app.use('/profile', profileRouter)
app.use('/auth/google', signingoogle)
app.use('/api',User)
const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("App is listening to port " + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
