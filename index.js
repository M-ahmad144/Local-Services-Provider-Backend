<<<<<<< HEAD
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
// Import mongoose module that will be used to connect to MongoDB.

const serviceProviderRouter = require("./Routes/ServiceProvider");
const signingoogle = require("./Routes/Signingoogle");

const { parse } = require("pg-connection-string");

// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHaandler");

// signin with google
const { OAuth2Client } = require("google-auth-library");

dotenv.config();

=======
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


>>>>>>> 57a852cb84dec6344710c44d2e452f61fac841ce
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
<<<<<<< HEAD
app.use("/serviceProvider", serviceProviderRouter);
app.use("/auth/google", signingoogle);

module.exports = app;
=======
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
>>>>>>> 57a852cb84dec6344710c44d2e452f61fac841ce
