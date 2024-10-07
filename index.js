const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
// Import routers
const serviceProviderRouter = require("./Routes/ServiceProvider");
const signingoogle = require("./Routes/Signingoogle");
const profileRouter = require("./Routes/Profile");
const userRouter = require("./Routes/User");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messagesRoutes");
const connectDB = require("./server");

// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHandler");

// Sign in with Google
const { OAuth2Client } = require("google-auth-library");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

const corsOptions = {
    origin: ['https://myneighbourly.vercel.app/', 'http://localhost:5173/'], // List of allowed origins
  };

  
// Middleware setup
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors(corsOptions));

// Set up routes
app.use("/serviceProvider", serviceProviderRouter);
app.use("/profile", profileRouter);
app.use("/auth/google", signingoogle);
app.use("/api", userRouter);
app.use("/chat", chatRoutes);
app.use("/messages", messageRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
