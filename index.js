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
const Reviews = require("./Routes/Review");

// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHandler");
// const Review = require("./Models/Review");

dotenv.config();

const app = express();
// CORS options
const corsOptions = {
  origin: ["https://myneighbourly.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable credentials
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or specify your domains
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


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
app.use("/review", Reviews);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
