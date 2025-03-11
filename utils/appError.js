class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // we will only send error message to the client if the error is operational

    Error.captureStackTrace(this, this.constructor);
    // Tells you where is the error
    // this.constructor -> remove unnecessary details
  }
}

module.exports = AppError;
