class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg);

    this.statusCode = statusCode; // Set the HTTP status code
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Determine the status type based on the status code
    this.isOperational = true; // Mark this error as operational (can be handled by the app)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
