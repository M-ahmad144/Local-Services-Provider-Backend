const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
// Import routers
const serviceProviderRouter = require("./Routes/ServiceProvider");
const signingoogle = require("./Routes/Signingoogle");
const profileRouter = require("./Routes/Profile");
const OrderRoutes = require("./Routes/Orders");
const userRouter = require("./Routes/User");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messagesRoutes");

const checkoutRoutes = require("./Routes/stripeCheckout");
const analyticsRoutes = require("./Routes/AnalyticsRoutes");

// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHandler");

dotenv.config();

const app = express();
// CORS options
const corsOptions = {
  origin: ["https://myneighbourly.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable credentials

  origin: ["https://myneighbourly.vercel.app", "http://localhost:5173"], // List of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers

  credentials: true, // Enable credentials (if needed)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
// Set up routes
app.use("/serviceProvider", serviceProviderRouter);
app.use("/profile", profileRouter);
app.use("/order", OrderRoutes);
app.use("/auth/google", signingoogle);
app.use("/api", userRouter);
app.use("/chat", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/payments", checkoutRoutes);
app.use("/analytics", analyticsRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
