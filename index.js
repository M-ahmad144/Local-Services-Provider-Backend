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

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/serviceProvider", serviceProviderRouter);
app.use("/auth/google", signingoogle);

module.exports = app;
