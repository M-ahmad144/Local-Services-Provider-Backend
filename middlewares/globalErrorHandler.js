const ErrorHandler = require("../utils/Error");

// Handle specific errors
const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue
    ? Object.values(err.keyValue).join(", ")
    : "unknown";
  const msg = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorHandler(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const msg = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandler(msg, 400);
};

const handleJWTErr = () =>
  new ErrorHandler("Invalid token. Please log in again.", 401);

const handleTokenExpiredError = () =>
  new ErrorHandler("Your token has expired! Please log in again.", 401);

// Send error response for development
const sendErrorDev = (err, req, res) => {
  console.error(err); // Log error for debugging in development
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message || "Internal Server Error",
    stack: err.stack || "No stack trace available",
  });
};

// Send error response for production
const sendErrorProd = (err, req, res) => {
  // Operational errors should show user-friendly messages
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status || "error",
      message: err.message || "An error occurred",
    });
  }

  // Non-operational errors should show a generic message
  return res.status(500).json({
    status: "error",
    message: "Something went wrong, please try again later.",
  });
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err }; // Create a copy of the error

    // Determine specific error type and handle accordingly
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTErr();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    // Send production error response
    sendErrorProd(error, req, res);
  }
};
