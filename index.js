const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import routers
const serviceProviderRouter = require("./Routes/ServiceProvider");
const signingoogle = require("./Routes/Signingoogle");
const profileRouter = require("./Routes/Profile");
const userRouter = require("./Routes/User");

// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHaandler");

// Sign in with Google
const { OAuth2Client } = require("google-auth-library");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Set up routes
app.use("/serviceProvider", serviceProviderRouter);
app.use("/profile", profileRouter);
app.use("/auth/google", signingoogle);
app.use("/api", userRouter);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
