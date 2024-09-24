const errorHandler = require("../utils/Error");

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new errorHandler(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue
    ? Object.values(err.keyValue).join(", ")
    : "unknown";
  const msg = `Duplicate field value: ${value}. Please use another value!`;
  return new errorHandler(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const msg = `Invalid input data. ${errors.join(". ")}`;
  return new errorHandler(msg, 400);
};

const handleJWTErr = () =>
  new errorHandler("Invalid token. Please log in again.", 401);

const handleTokenExpiredError = () =>
  new errorHandler("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message || "Internal Server Error",
    stack: err.stack || "No stack trace available",
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status || "error",
      message: err.message || "An error occurred",
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong, please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message || "Internal Server Error";
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTErr();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
